"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Twitter,
  Instagram,
  Globe,
  Linkedin,
  Camera,
} from "lucide-react";

const MAX_BIO_LENGTH = 160;

export default function ProfileManagement() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    avatarImage: "", // Changed from 'image' to 'avatarImage'
    coverImage: "",
    bio: "",
    socialLinks: {
      twitter: "",
      instagram: "",
      linkedin: "",
      website: "",
    },
  });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated" && session?.user?.email) {
      fetchProfile();
    }
  }, [status, session, router]);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/profile");
      if (response.ok) {
        const data = await response.json();
        setProfile({
          ...data,
          avatarImage: data.avatarImage || "", // Changed from 'image' to 'avatarImage'
          bio: data.bio || "",
          coverImage: data.coverImage || "",
          socialLinks: {
            twitter: data.socialLinks?.twitter || "",
            instagram: data.socialLinks?.instagram || "",
            linkedin: data.socialLinks?.linkedin || "",
            website: data.socialLinks?.website || "",
          },
        });
      } else {
        setAlert({ type: "error", message: "Failed to fetch profile" });
      }
    } catch (error) {
      setAlert({ type: "error", message: "An unexpected error occurred" });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setProfile((prev) => ({
        ...prev,
        [parent]: {
          ...((prev[parent as keyof typeof prev] || {}) as Record<
            string,
            unknown
          >),
          [child]: value,
        },
      }));
    } else {
      setProfile((prev) => ({ ...prev, [name]: value }));
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

        fetchProfile();
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

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar_image", file);

    try {
      setIsLoading(true);
      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setProfile((prev) => ({ ...prev, avatarImage: data.imageUrl })); // Changed from 'image' to 'avatarImage'
        setAlert({ type: "success", message: "Avatar uploaded successfully" });

        await update({
          ...session,
          user: {
            ...session?.user,
            avatarImage: data.imageUrl, // Changed from 'image' to 'avatarImage'
          },
        });
      } else {
        setAlert({
          type: "error",
          message: `Failed to upload avatar: ${data.message}`,
        });
        console.error("Avatar upload error:", data);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setAlert({
        type: "error",
        message: `An unexpected error occurred: ${errorMessage}`,
      });
      console.error("Avatar upload error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("cover_image", file);

    try {
      setIsLoading(true);
      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setProfile((prev) => ({ ...prev, coverImage: data.imageUrl }));
        setAlert({ type: "success", message: "Cover image uploaded successfully" });

        await update({
          ...session,
          user: {
            ...session?.user,
            coverImage: data.imageUrl,
          },
        });
      } else {
        setAlert({
          type: "error",
          message: `Failed to upload cover image: ${data.message}`,
        });
        console.error("Cover image upload error:", data);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setAlert({
        type: "error",
        message: `An unexpected error occurred: ${errorMessage}`,
      });
      console.error("Cover image upload error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

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
                    <img
                      src={profile.coverImage}
                      alt="Cover"
                      className="w-full h-full object-cover"
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
                  <AvatarImage src={profile.avatarImage} alt={profile.name} /> {/* Changed from 'image' to 'avatarImage' */}
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
                >
                  Change Avatar
                </Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={profile.name}
                  onChange={handleInputChange}
                  required
                  className="rounded-xl"
                />
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
                  className="rounded-xl"
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
                  className="rounded-xl"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {profile.bio.length}/{MAX_BIO_LENGTH} characters
                </p>
              </div>
              <div className="space-y-2">
                <Label>Social Media Links</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Twitter className="h-5 w-5 text-gray-400" />
                    <Input
                      name="socialLinks.twitter"
                      placeholder="Twitter"
                      value={profile.socialLinks.twitter}
                      onChange={handleInputChange}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Instagram className="h-5 w-5 text-gray-400" />
                    <Input
                      name="socialLinks.instagram"
                      placeholder="Instagram"
                      value={profile.socialLinks.instagram}
                      onChange={handleInputChange}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Linkedin className="h-5 w-5 text-gray-400" />
                    <Input
                      name="socialLinks.linkedin"
                      placeholder="LinkedIn"
                      value={profile.socialLinks.linkedin}
                      onChange={handleInputChange}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="h-5 w-5 text-gray-400" />
                    <Input
                      name="socialLinks.website"
                      placeholder="Website"
                      value={profile.socialLinks.website}
                      onChange={handleInputChange}
                      className="rounded-xl"
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
                  className="rounded-xl"
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
                  className="rounded-xl"
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
                  className="rounded-xl"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-red-600 dark:hover:bg-red-400 h-12 text-base rounded-xl"
                disabled={isLoading}
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