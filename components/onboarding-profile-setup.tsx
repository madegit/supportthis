"use client";

import type React from "react";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEdgeStore } from "@/lib/edgestore";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertCircle,
  CheckCircle2,
  Github,
  Twitter,
  Instagram,
  Globe,
  Camera,
  Upload,
} from "lucide-react";

const MAX_BIO_LENGTH = 160;
const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface OnboardingProfileSetupProps {
  onComplete?: () => void;
}

export default function OnboardingProfileSetup({
  onComplete,
}: OnboardingProfileSetupProps) {
  const { data: session, update } = useSession();
  const { edgestore } = useEdgeStore();
  const { data: profile, error, mutate } = useSWR("/api/profile", fetcher);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      mutate(
        {
          ...profile,
          [parent]: {
            ...profile[parent],
            [child]: value,
          },
        },
        false,
      );
    } else {
      mutate({ ...profile, [name]: value }, false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAlert({ type: "", message: "" });

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        const data = await response.json();
        setAlert({
          type: "success",
          message: "Profile setup completed successfully!",
        });

        await update({
          ...session,
          user: {
            ...session?.user,
            ...data.user,
          },
        });

        mutate(data.user);

        if (onComplete) {
          setTimeout(() => onComplete(), 1500);
        }
      } else {
        const data = await response.json();
        setAlert({
          type: "error",
          message: data.message || "Failed to update profile",
        });
      }
    } catch (error) {
      setAlert({ type: "error", message: "An unexpected error occurred" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (file: File, type: "avatar" | "cover") => {
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadProgress(0);
      const res = await edgestore.publicFiles.upload({
        file,
        onProgressChange: (progress) => {
          setUploadProgress(progress);
        },
        options: {
          replaceTargetUrl:
            type === "avatar" ? profile?.avatarImage : profile?.coverImage,
        },
      });

      if (res.url) {
        const updatedProfile = {
          ...profile,
          [type === "avatar" ? "avatarImage" : "coverImage"]: res.url,
        };
        mutate(updatedProfile, false);

        const response = await fetch("/api/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedProfile),
        });

        if (response.ok) {
          const data = await response.json();
          setAlert({
            type: "success",
            message: `${type === "avatar" ? "Avatar" : "Cover image"} updated successfully`,
          });
          mutate();
        }
      }
    } catch (error) {
      setAlert({
        type: "error",
        message: "Failed to upload image",
      });
      mutate();
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  if (error)
    return <div className="text-white p-6">Failed to load profile</div>;
  if (!profile)
    return (
      <div className="flex items-center justify-center h-full text-white p-6">
        Loading...
      </div>
    );

  return (
    <div className="h-full overflow-y-auto bg-black">
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        {alert.type && (
          <Alert
            variant={alert.type === "error" ? "destructive" : "default"}
            className="bg-gray-800/50 border-gray-600 text-white"
          >
            {alert.type === "error" ? (
              <AlertCircle className="h-4 w-4" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Images Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Profile Images</h3>

            {/* Cover Image */}
            <div className="space-y-2">
              <Label className="text-gray-300 text-sm">Cover Image</Label>
              <div className="relative">
                <div className="h-32 w-full bg-gray-800/50 border border-gray-600 rounded-lg overflow-hidden">
                  {profile.coverImage ? (
                    <Image
                      src={profile.coverImage || "/placeholder.svg"}
                      alt="Cover"
                      className="w-full h-full object-cover"
                      width={500}
                      height={128}
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Camera className="h-8 w-8" />
                    </div>
                  )}
                </div>
                <Button
                  type="button"
                  onClick={() => coverInputRef.current?.click()}
                  className="absolute bottom-2 right-2 bg-gray-900/80 hover:bg-gray-800 text-white rounded-lg p-2 h-8 w-8"
                  disabled={isUploading}
                >
                  <Upload className="h-3 w-3" />
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files?.[0] &&
                    handleImageUpload(e.target.files[0], "cover")
                  }
                  ref={coverInputRef}
                  className="hidden"
                />
              </div>
            </div>

            {/* Avatar */}
            <div className="space-y-2">
              <Label className="text-gray-300 text-sm">Profile Picture</Label>
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={profile.avatarImage || "/placeholder.svg"}
                    alt={profile.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-gray-700 text-white">
                    {profile.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <Button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="bg-gray-800/50 border border-gray-600 text-white hover:bg-gray-700/50 rounded-lg h-9 px-4 text-sm"
                  disabled={isUploading}
                >
                  <Upload className="h-3 w-3 mr-2" />
                  Upload
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files?.[0] &&
                    handleImageUpload(e.target.files[0], "avatar")
                  }
                  ref={avatarInputRef}
                  className="hidden"
                />
              </div>
              {isUploading && (
                <div className="space-y-1">
                  <Progress value={uploadProgress} className="w-full h-1" />
                  <p className="text-gray-400 text-xs">
                    Uploading: {uploadProgress}%
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">
              Basic Information
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-gray-300 text-sm">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  name="name"
                  value={profile.name?.split(" ")[0] || ""}
                  onChange={(e) => {
                    const lastName =
                      profile.name?.split(" ").slice(1).join(" ") || "";
                    handleInputChange({
                      target: {
                        name: "name",
                        value: `${e.target.value} ${lastName}`.trim(),
                      },
                    } as any);
                  }}
                  placeholder="e.g. John"
                  className="bg-gray-800/80 border-gray-600 text-white placeholder-gray-400 rounded-lg h-11 focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-gray-300 text-sm">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  value={profile.name?.split(" ").slice(1).join(" ") || ""}
                  onChange={(e) => {
                    const firstName = profile.name?.split(" ")[0] || "";
                    handleInputChange({
                      target: {
                        name: "name",
                        value: `${firstName} ${e.target.value}`.trim(),
                      },
                    } as any);
                  }}
                  placeholder="e.g. Francisco"
                  className="bg-gray-800/80 border-gray-600 text-white placeholder-gray-400 rounded-lg h-11 focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-300 text-sm">
                Username
              </Label>
              <Input
                id="username"
                name="username"
                value={profile.username || ""}
                onChange={handleInputChange}
                placeholder="e.g. johnfrans"
                className="bg-gray-800/80 border-gray-600 text-white placeholder-gray-400 rounded-lg h-11 focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-gray-300 text-sm">
                Bio
              </Label>
              <Textarea
                id="bio"
                name="bio"
                value={profile.bio || ""}
                onChange={handleInputChange}
                maxLength={MAX_BIO_LENGTH}
                rows={3}
                placeholder="Tell us about yourself..."
                className="bg-gray-800/80 border-gray-600 text-white placeholder-gray-400 rounded-lg focus:border-gray-500 focus:ring-1 focus:ring-gray-500 resize-none"
              />
              <p className="text-gray-400 text-xs">
                {(profile.bio || "").length}/{MAX_BIO_LENGTH} characters
              </p>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">
              Social Links (Optional)
            </h3>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-800/50 rounded-lg flex items-center justify-center">
                  <Github className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  name="socialLinks.github"
                  placeholder="https://github.com/username"
                  value={profile.socialLinks?.github || ""}
                  onChange={handleInputChange}
                  className="bg-gray-800/80 border-gray-600 text-white placeholder-gray-400 rounded-lg h-11 focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                />
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-800/50 rounded-lg flex items-center justify-center">
                  <Twitter className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  name="socialLinks.twitter"
                  placeholder="https://twitter.com/username"
                  value={profile.socialLinks?.twitter || ""}
                  onChange={handleInputChange}
                  className="bg-gray-800/80 border-gray-600 text-white placeholder-gray-400 rounded-lg h-11 focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                />
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-800/50 rounded-lg flex items-center justify-center">
                  <Instagram className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  name="socialLinks.instagram"
                  placeholder="https://instagram.com/username"
                  value={profile.socialLinks?.instagram || ""}
                  onChange={handleInputChange}
                  className="bg-gray-800/80 border-gray-600 text-white placeholder-gray-400 rounded-lg h-11 focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                />
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-800/50 rounded-lg flex items-center justify-center">
                  <Globe className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  name="socialLinks.website"
                  placeholder="https://mywebsite.com"
                  value={profile.socialLinks?.website || ""}
                  onChange={handleInputChange}
                  className="bg-gray-800/80 border-gray-600 text-white placeholder-gray-400 rounded-lg h-11 focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              disabled={isLoading || isUploading}
              className="w-full bg-white text-black hover:bg-gray-100 h-11 text-sm font-medium rounded-lg transition-colors"
            >
              {isLoading ? "Completing Setup..." : "Complete Profile Setup"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
