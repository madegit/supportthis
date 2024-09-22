"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import Image from 'next/image'
import { useRouter } from "next/navigation";
import { useEdgeStore } from '@/lib/edgestore';
import useSWR from 'swr'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertCircle,
  CheckCircle2,
  Github,
  Twitter,
  Instagram,
  Globe,
  Linkedin,
  Camera,
} from "lucide-react";

const MAX_BIO_LENGTH = 160;

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Component() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const { edgestore } = useEdgeStore();
  const { data: profile, error, mutate } = useSWR('/api/profile', fetcher);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  const handleInputChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      mutate({
        ...profile,
        [parent]: {
          ...profile[parent],
          [child]: value,
        },
      }, false);
    } else {
      mutate({ ...profile, [name]: value }, false);
    }

    if (name === 'username') {
      setIsCheckingUsername(true);
      try {
        const response = await fetch(`/api/check-username?username=${value}`);
        const data = await response.json();
        if (!data.available) {
          setAlert({ type: "error", message: "Username is already taken" });
        } else {
          setAlert({ type: "", message: "" });
        }
      } catch (error) {
        console.error('Error checking username:', error);
      }
      setIsCheckingUsername(false);
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
        body: JSON.stringify({
          ...profile,
          currentPassword,
          newPassword,
          confirmNewPassword,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAlert({ type: "success", message: "Profile updated successfully" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");

        await update({
          ...session,
          user: {
            ...session?.user,
            ...data.user,
          },
        });

        mutate(data.user);
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

  const handleImageUpload = async (file: File, type: 'avatar' | 'cover') => {
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
          replaceTargetUrl: type === 'avatar' ? profile.avatarImage : profile.coverImage,
        },
      });

      if (res.url) {
        const updatedProfile = { ...profile, [type === 'avatar' ? 'avatarImage' : 'coverImage']: res.url };

        // Optimistic update
        mutate(updatedProfile, false);

        // Update profile on the server
        const response = await fetch("/api/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedProfile),
        });

        if (response.ok) {
          const data = await response.json();
          setAlert({ type: "success", message: `${type === 'avatar' ? 'Avatar' : 'Cover image'} updated successfully` });

          // Update session
          await update({
            ...session,
            user: {
              ...session?.user,
              ...data.user,
            },
          });

          // Revalidate the data
          mutate();
        } else {
          throw new Error('Failed to update profile');
        }
      } else {
        throw new Error('Failed to upload image');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setAlert({
        type: "error",
        message: `An unexpected error occurred: ${errorMessage}`,
      });
      console.error(`${type === 'avatar' ? 'Avatar' : 'Cover image'} upload error:`, error);

      // Revert optimistic update
      mutate();
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleImageUpload(file, 'avatar');
    }
  };

  const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleImageUpload(file, 'cover');
    }
  };

  if (error) return <div>Failed to load profile</div>;
  if (!profile) return <div className="flex items-center justify-center h-screen">Loading...</div>
;

  return (
    <div className="min-h-screen bg-red-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-8 px-4">
      <div className="container pt-812 mx-auto max-w-lg">
        <Card className="bg-white dark:bg-gray-800 bg-opacity-50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold tracking-[-1.5px]">
              Profile Settings
            </CardTitle>
            <CardDescription>Update your profile information</CardDescription>
          </CardHeader>
          <CardContent>
            {alert.type && (
              <Alert
                variant={alert.type === "error" ? "destructive" : "default"}
                className="mb-4"
              >
                {alert.type === "error" ? (
                  <AlertCircle className="h-5 w-5" />
                ) : (
                  <CheckCircle2 className="h-5 w-5" />
                )}
                <AlertTitle>
                  {alert.type === "error" ? "Error" : "Success"}
                </AlertTitle>
                <AlertDescription>{alert.message}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative mb-8">
                <div className="h-32 w-full bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden">
                  {profile.coverImage ? (
                    <Image
                      src={profile.coverImage}
                      alt="Cover"
                      className="w-full h-full object-cover"
                      width={500}
                      height={128}
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Camera className="h-12 w-12" />
                      <span className="ml-2">No cover image</span>
                    </div>
                  )}
                </div>
                <Button
                  type="button"
                  onClick={() => coverInputRef.current?.click()}
                  className="absolute bottom-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
                  disabled={isUploading}
                >
                  <Camera className="h-5 w-5" />
                  <span className="sr-only">Change Cover Image</span>
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageUpload}
                  ref={coverInputRef}
                  className="hidden"
                />
              </div>
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile.avatarImage} alt={profile.name} className="w-full h-full object-cover"/>
                  <AvatarFallback>{profile.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  ref={avatarInputRef}
                  className="hidden"
                />
                <Button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="bg-black dark:bg-white text-white dark:text-black hover:bg-red-600 dark:hover:bg-red-400 rounded-xl"
                  disabled={isUploading}
                >
                  Change Avatar
                </Button>
              </div>
              {isUploading && (
                <div className="mt-2">
                  <Progress value={uploadProgress} className="w-full" />
                  <p className="text-sm text-gray-500 mt-1">Uploading: {uploadProgress}%</p>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={profile.name}
                  onChange={handleInputChange}
                  required
                  className="rounded-xl dark:bg-gray-900"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  value={profile.username}
                  onChange={handleInputChange}
                  required
                  className="rounded-xl dark:bg-gray-900"
                />
                {isCheckingUsername && <p className="text-sm text-gray-500">Checking username availability...</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  value={profile.email}
                  onChange={handleInputChange}
                  required
                  disabled
                  className="rounded-xl dark:bg-gray-900"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={profile.bio}
                  onChange={handleInputChange}
                  maxLength={MAX_BIO_LENGTH}
                  rows={3}
                  className="rounded-xl dark:bg-gray-900"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {profile.bio.length}/{MAX_BIO_LENGTH} characters
                </p>
              </div>
              <div className="space-y-2">
                <Label>Social Media Links</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Github className="h-5 w-5 text-gray-400" />
                    <Input
                      name="socialLinks.github"
                      placeholder="https://github.com/username"
                      value={profile.socialLinks.github}
                      onChange={handleInputChange}
                      className="rounded-xl dark:bg-gray-900"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Twitter className="h-5 w-5 text-gray-400" />
                    <Input
                      name="socialLinks.twitter"
                    placeholder="https://twitter.com/username"
                      value={profile.socialLinks.twitter}
                      onChange={handleInputChange}
                      className="rounded-xl dark:bg-gray-900"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Instagram className="h-5 w-5 text-gray-400" />
                    <Input
                      name="socialLinks.instagram"
                  placeholder="https://instagram.com/username"
                      value={profile.socialLinks.instagram}
                      onChange={handleInputChange}
                      className="rounded-xl dark:bg-gray-900"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Linkedin className="h-5 w-5 text-gray-400" />
                    <Input
                      name="socialLinks.linkedin"
                    placeholder="https://linkedin.com/username"
                      value={profile.socialLinks.linkedin}
                      onChange={handleInputChange}
                      className="rounded-xl dark:bg-gray-900"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="h-5 w-5 text-gray-400" />
                    <Input
                      name="socialLinks.website"
                      placeholder="https://mywebsite.com/"
                      value={profile.socialLinks.website}
                      onChange={handleInputChange}
                      className="rounded-xl dark:bg-gray-900"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="rounded-xl dark:bg-gray-900"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="rounded-xl dark:bg-gray-900"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                <Input
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="rounded-xl dark:bg-gray-900"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-red-600 dark:hover:bg-red-600 dark:hover:text-white h-12 text-base rounded-xl"
                disabled={isLoading || isUploading || isCheckingUsername}
              >
                {isLoading ? "Updating..." : "Update Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}