
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Star, Users, Award, Mail, Phone, MapPin } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-blue-400" />
            <h1 className="text-2xl font-bold text-white">EduTech LMS</h1>
          </div>
          <div className="space-x-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/login')}
              className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white transition-all duration-300"
            >
              Login
            </Button>
            <Button 
              onClick={() => navigate('/signup')}
              className="bg-blue-600 hover:bg-blue-700 transition-all duration-300"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="animate-fade-in">
          <h2 className="text-5xl font-bold text-white mb-6">
            Welcome to Our Learning Management System
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Empowering students with world-class education and innovative learning experiences.
            Join thousands of learners on their journey to success.
          </p>
          <div className="space-x-4">
            <Button 
              size="lg" 
              onClick={() => navigate('/signup')}
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3 transition-all duration-300 hover-scale"
            >
              Get Started
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white text-lg px-8 py-3 transition-all duration-300"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Admin Profile Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-white mb-4">Meet Our Lead Educator</h3>
          <p className="text-gray-300 text-lg">Excellence in education leadership</p>
        </div>
        
        <Card className="max-w-4xl mx-auto bg-gray-800/50 border-gray-700 backdrop-blur-sm animate-scale-in">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                <span className="text-6xl font-bold text-white">AS</span>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h4 className="text-2xl font-bold text-white mb-2">Dr. Ahmed Salam</h4>
                <p className="text-blue-400 text-lg mb-4">Chief Educational Officer</p>
                <p className="text-gray-300 mb-6">
                  With over 15 years of experience in educational technology and curriculum development, 
                  Dr. Salam has revolutionized online learning for thousands of students worldwide.
                </p>
                
                {/* Achievements */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                    <Award className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                    <p className="text-white font-semibold">PhD in Education</p>
                    <p className="text-gray-400 text-sm">Stanford University</p>
                  </div>
                  <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                    <Users className="h-8 w-8 text-green-400 mx-auto mb-2" />
                    <p className="text-white font-semibold">10,000+ Students</p>
                    <p className="text-gray-400 text-sm">Successfully Mentored</p>
                  </div>
                  <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                    <Star className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                    <p className="text-white font-semibold">4.9/5 Rating</p>
                    <p className="text-gray-400 text-sm">Student Reviews</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Student Reviews */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-white mb-4">What Our Students Say</h3>
          <p className="text-gray-300 text-lg">Real feedback from our learning community</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "Sarah Johnson",
              course: "Web Development",
              review: "The curriculum is comprehensive and the support is amazing. I landed my dream job after completing the course!",
              rating: 5
            },
            {
              name: "Michael Chen",
              course: "Data Science",
              review: "Excellent instructors and practical projects. The hands-on approach really helped me understand complex concepts.",
              rating: 5
            },
            {
              name: "Emma Rodriguez",
              course: "Digital Marketing",
              review: "The best investment I've made in my career. The knowledge I gained here transformed my professional life.",
              rating: 5
            }
          ].map((review, index) => (
            <Card key={index} className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover-scale">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                    <span className="text-white font-bold">{review.name.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg">{review.name}</CardTitle>
                    <CardDescription className="text-blue-400">{review.course}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300">{review.review}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Contact Information */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-white mb-4">Get In Touch</h3>
          <p className="text-gray-300 text-lg">We're here to help you succeed</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm text-center hover-scale">
            <CardContent className="p-6">
              <Mail className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h4 className="text-white font-semibold mb-2">Email Us</h4>
              <p className="text-gray-300">support@edutech.com</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm text-center hover-scale">
            <CardContent className="p-6">
              <Phone className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h4 className="text-white font-semibold mb-2">Call Us</h4>
              <p className="text-gray-300">+1 (555) 123-4567</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm text-center hover-scale">
            <CardContent className="p-6">
              <MapPin className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h4 className="text-white font-semibold mb-2">Visit Us</h4>
              <p className="text-gray-300">123 Education St, Learning City</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800/50 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">&copy; 2024 EduTech LMS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
