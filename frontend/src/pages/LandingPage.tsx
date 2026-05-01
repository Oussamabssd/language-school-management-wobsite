import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Users,
  Calendar,
  ShieldCheck,
  Globe,
  Award,
} from "lucide-react";
import logo from "../assets/ecole-logo.jpg";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-100/50 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -80, 0],
            y: [0, 100, 0],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-100/50 rounded-full blur-[140px]"
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center overflow-hidden shadow-sm border border-slate-100">
            <img src={logo} alt="Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-xl font-black text-slate-900 tracking-tight">
            SpeakUp<span className="text-primary-600">School</span>
          </span>
        </div>
        <div className="hidden md:flex items-center space-x-8 text-sm font-bold text-slate-600">
          <a href="#features" className="hover:text-primary-600 transition-colors">Features</a>
          <a href="#about" className="hover:text-primary-600 transition-colors">About Us</a>
          <button 
            onClick={() => navigate("/login")}
            className="px-6 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
          >
            Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-bold text-primary-600 mb-8 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            <span>Empowering Language Learners Worldwide</span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tight">
            Master Any Language <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-600">
              With Confidence.
            </span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
            The all-in-one management platform for SpeakUp School. 
            Join thousands of students and expert teachers in a seamless educational experience.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate("/register-request")}
              className="w-full sm:w-auto px-10 py-5 bg-primary-600 text-white rounded-2xl font-bold text-lg shadow-2xl shadow-primary-200 hover:bg-primary-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
            >
              Get Started Now <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate("/login")}
              className="w-full sm:w-auto px-10 py-5 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
            >
              Login to Dashboard
            </button>
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
        >
          {[
            { label: "Active Students", value: "2,500+", icon: Users },
            { label: "Expert Teachers", value: "150+", icon: ShieldCheck },
            { label: "Languages Offered", value: "12+", icon: Globe },
            { label: "Success Rate", value: "98%", icon: Award },
          ].map((stat, i) => (
            <div key={i} className="text-center group">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary-600 mx-auto mb-4 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="text-3xl font-black text-slate-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </main>

      {/* Features Grid */}
      <section id="features" className="relative z-10 bg-white py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Everything you need to succeed</h2>
            <p className="text-slate-500 font-medium max-w-xl mx-auto">
              Our comprehensive management system ensures you stay focused on what matters: learning and teaching.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Dynamic Timetables",
                desc: "Stay organized with real-time schedule updates and session management.",
                icon: <Calendar className="w-6 h-6" />,
                color: "bg-blue-500",
              },
              {
                title: "Resource Sharing",
                desc: "Access course materials, homework, and resources anytime, anywhere.",
                icon: <BookOpen className="w-6 h-6" />,
                color: "bg-primary-500",
              },
              {
                title: "Student Progress",
                desc: "Detailed tracking of grades, attendance, and pedagogical feedback.",
                icon: <Award className="w-6 h-6" />,
                color: "bg-indigo-500",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="p-10 rounded-[40px] bg-slate-50 border border-slate-100 hover:shadow-2xl hover:shadow-slate-200 transition-all"
              >
                <div className={`w-14 h-14 ${feature.color} text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center overflow-hidden">
                <img src={logo} alt="Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-xl font-black tracking-tight">
                SpeakUp<span className="text-primary-400">School</span>
              </span>
            </div>
            <div className="flex items-center space-x-10 text-sm font-bold text-slate-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm font-medium">
            &copy; 2026 SpeakUp School Management. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
