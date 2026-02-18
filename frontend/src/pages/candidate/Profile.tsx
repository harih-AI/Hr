import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Upload, Mail, Phone, MapPin, Globe, Linkedin, Github, Loader2, Video, Calendar, MessageSquare } from "lucide-react";
import CandidateLayout from "@/components/layout/CandidateLayout";
import { useProfileStore } from "@/store/useProfileStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

export default function CandidateProfile() {
    const { profile, fetchProfile, updateProfile, uploadResume, isLoading } = useProfileStore();
    const { register, handleSubmit, reset } = useForm();
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    useEffect(() => {
        if (profile) {
            reset(profile);
        }
    }, [profile, reset]);

    const onSubmit = (data: any) => {
        updateProfile(data);
    };

    const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            await uploadResume(e.target.files[0]);
        }
    };

    return (
        <CandidateLayout>
            <div className="space-y-8 max-w-4xl">
                {/* Interview Notification Card */}
                {(profile?.status === 'Interviewing' || profile?.status === 'Approved') && (
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg animate-in slide-in-from-top duration-500">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                                    <Video className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">Your AI Interview is ready!</h3>
                                    <p className="text-blue-100 text-sm">Talent Scout AI is waiting to chat with you about your experience.</p>
                                </div>
                            </div>
                            <Link to="/candidate/ai-interview">
                                <Button className="bg-white text-blue-600 hover:bg-blue-50 font-bold px-6">
                                    Start Interview Now
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-2xl bg-gray-200 border-2 border-white shadow-soft overflow-hidden">
                                {profile?.avatar ? <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[#7B7F85]"><Upload className="w-8 h-8" /></div>}
                            </div>
                            <button className="absolute -bottom-2 -right-2 p-2 rounded-lg bg-[#8017E1] text-white shadow-soft hover:bg-[#8017E1]/90">
                                <Upload className="w-4 h-4" />
                            </button>
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold text-[#2B2E33]">{profile?.firstName} {profile?.lastName}</h1>
                                {profile?.status && (
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${profile.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                        profile.status === 'Interviewing' ? 'bg-blue-100 text-blue-700' :
                                            'bg-gray-100 text-gray-700'
                                        }`}>
                                        {profile.status}
                                    </div>
                                )}
                            </div>
                            <p className="text-[#7B7F85] font-medium">{profile?.headline}</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={() => {
                                if (confirm("Reset profile for demo? This will clear current fields.")) {
                                    updateProfile({
                                        firstName: '', lastName: '', summary: '', headline: '', phone: '',
                                        skills: { technical: [], soft: [], tools: [] },
                                        experience: [],
                                        status: 'Applied',
                                        resumeUrl: null
                                    });
                                }
                            }}
                            className="h-11 px-6 font-semibold border-destructive text-destructive hover:bg-destructive/5"
                        >
                            Reset Profile
                        </Button>
                        <Button onClick={handleSubmit(onSubmit)} disabled={isLoading} className="bg-[#8017E1] hover:bg-[#8017E1]/90 h-11 px-8 font-bold">
                            {isLoading ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </header>

                <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
                    {/* General Information */}
                    <section className="bg-white border border-[#C1C4C8] rounded-xl p-8 space-y-6">
                        <h2 className="text-xl font-bold text-[#2B2E33]">Personal Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input id="firstName" {...register("firstName")} className="border-[#C1C4C8] focus:border-[#8017E1]" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input id="lastName" {...register("lastName")} className="border-[#C1C4C8] focus:border-[#8017E1]" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" type="email" {...register("email")} className="border-[#C1C4C8] focus:border-[#8017E1]" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input id="phone" {...register("phone")} className="border-[#C1C4C8] focus:border-[#8017E1]" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="summary">About Me</Label>
                            <Textarea id="summary" {...register("summary")} className="min-h-[120px] border-[#C1C4C8] focus:border-[#8017E1]" />
                        </div>
                    </section>

                    {/* Social Links */}
                    <section className="bg-white border border-[#C1C4C8] rounded-xl p-8 space-y-6">
                        <h2 className="text-xl font-bold text-[#2B2E33]">Professional Links</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-[#7B7F85] border border-[#C1C4C8]">
                                    <Linkedin className="w-5 h-5" />
                                </div>
                                <Input placeholder="LinkedIn Profile" {...register("links.linkedin")} className="border-[#C1C4C8] focus:border-[#8017E1]" />
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-[#7B7F85] border border-[#C1C4C8]">
                                    <Github className="w-5 h-5" />
                                </div>
                                <Input placeholder="GitHub Profile" {...register("links.github")} className="border-[#C1C4C8] focus:border-[#8017E1]" />
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-[#7B7F85] border border-[#C1C4C8]">
                                    <Globe className="w-5 h-5" />
                                </div>
                                <Input placeholder="Portfolio Website" {...register("links.portfolio")} className="border-[#C1C4C8] focus:border-[#8017E1]" />
                            </div>
                        </div>
                    </section>

                    {/* Resume Upload */}
                    <section className="bg-white border border-[#C1C4C8] rounded-xl p-8 space-y-6">
                        <h2 className="text-xl font-bold text-[#2B2E33]">Documents</h2>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleResumeUpload}
                            className="hidden"
                            accept=".pdf,.docx,.txt"
                        />
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-[#C1C4C8] rounded-2xl p-10 flex flex-col items-center justify-center text-center bg-[#F5F6F7] hover:border-[#8017E1]/50 transition-colors cursor-pointer"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-[#8017E1]/10 flex items-center justify-center text-[#8017E1] mb-4">
                                {isLoading ? <Loader2 className="w-8 h-8 animate-spin" /> : <Upload className="w-8 h-8" />}
                            </div>
                            <h3 className="font-bold text-[#2B2E33]">
                                {profile?.resumeUrl ? "Resume Uploaded" : "Upload your latest resume"}
                            </h3>
                            <p className="text-sm text-[#7B7F85] mt-2 mb-6 max-w-xs">
                                {profile?.resumeUrl ? "You can click to replace your current resume" : "PDF, DOCX and TXT formats are supported (Max 5MB)"}
                            </p>
                            <Button
                                type="button"
                                variant="outline"
                                className="border-[#8017E1] text-[#8017E1] hover:bg-[#8017E1]/5 font-bold"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    fileInputRef.current?.click();
                                }}
                            >
                                {profile?.resumeUrl ? "Replace File" : "Choose File"}
                            </Button>
                        </div>
                    </section>
                </form>
            </div>
        </CandidateLayout>
    );
}
