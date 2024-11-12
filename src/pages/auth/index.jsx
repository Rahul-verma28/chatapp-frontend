import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList } from '@/components/ui/tabs';
import { TabsContent, TabsTrigger } from '@radix-ui/react-tabs';
import React, { useState } from 'react';
import Background from "@/assets/login2.png";
import Victory from "@/assets/victory.svg";
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import { LOGIN_ROUTE, SIGNUP_ROUTE } from '@/utils/constants';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store';

const Auth = () => {  
  const navigate = useNavigate();
  const { setUserInfo } = useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

  const validateLogin = () => {
    if (!email.length) {
      toast.error("Email is required.");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required.");
      return false;
    }
    return true;
  };

  const validateSignup = () => {
    if (!email.length) {
      toast.error("Email is required.");
      return false;
    }
    if (!emailRegex.test(email)) {
      toast.error("Enter a valid email address.");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required.");
      return false;
    }
    if (!passwordRegex.test(password)) {
      toast.error("Password must be at least 6 characters, including an uppercase letter, a lowercase letter, a number, and a special character.");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Password and Confirm Password should match.");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    try {
      if (validateLogin()) {
        const response = await apiClient.post(LOGIN_ROUTE, { email, password }, { withCredentials: true });
        toast.success("Logged in successfully");

        if (response.data.user.id) {
          setUserInfo(response.data.user);
          navigate(response.data.user.profileSetup ? "/chat" : "/profile");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  const handleSignup = async () => {
    try {
      if (validateSignup()) {
        const response = await apiClient.post(SIGNUP_ROUTE, { email, password }, { withCredentials: true });
        toast.success("Successfully registered");

        if (response.data.user.id) {
          setUserInfo(response.data.user);
          navigate("/profile");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="h-screen w-[100vw] flex items-center justify-center px-8 bg-white">
      <div className="h-auto w-auto bg-white text-opacity-90 shadow-2xl rounded-3xl grid xl:grid-cols-2 p-5 pb-8">
        <div className="flex flex-col gap-2 items-center justify-center">
          <div className="flex items-center justify-center flex-col">
            <div className="flex items-center justify-center text-center">
              <h1 className="text-5xl font-bold md:text-6x1">Welcome</h1>
              <img src={Victory} alt="Victory Emoji" className="h-[100px]" />
            </div>
            <p className="font-medium text-center">Fill in the details to get started with the best chat app</p>
          </div>
          <div className="flex items-center justify-center w-full">
            <Tabs className="w-[90%]" defaultValue="login">
              <TabsList className="bg-transparent rounded-none w-full">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300">
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300">
                  Signup
                </TabsTrigger>
              </TabsList>
              <TabsContent className="flex flex-col gap-5 mt-10" value="login">
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} />
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full p-6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} />
                <Button className="rounded-full p-6" onClick={() => handleLogin()}>
                  Sign In
                </Button>
              </TabsContent>
              <TabsContent className="flex flex-col gap-5" value="signup">
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} />
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full p-6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} />
                <Input
                  placeholder="Confirm Password"
                  type="password"
                  className="rounded-full p-6"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)} />
                <Button className="rounded-full p-6" onClick={() => handleSignup()}>
                  Signup
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="hidden xl:flex justify-center items-center">
          <img src={Background} alt="background login" height={300} width={300} />
        </div>
      </div>
    </div>
  );
};
export default Auth;
