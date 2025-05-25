
import React from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Users, Star, BookOpen } from 'lucide-react';

const CourseDetail = () => {
  const { courseId } = useParams();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Course Header */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl text-white">JavaScript Fundamentals</CardTitle>
            <CardDescription className="text-gray-400">
              Master the building blocks of modern web development
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-6 mb-6">
              <div className="flex items-center space-x-2 text-gray-400">
                <Clock className="h-4 w-4" />
                <span>8 weeks</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Users className="h-4 w-4" />
                <span>150 students</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>4.8 (120 reviews)</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
                Enroll Now - $99
              </Button>
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                Preview Course
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Course Details Tabs */}
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800">
            <TabsTrigger value="description" className="data-[state=active]:bg-blue-600">Description</TabsTrigger>
            <TabsTrigger value="curriculum" className="data-[state=active]:bg-blue-600">Curriculum</TabsTrigger>
            <TabsTrigger value="outcomes" className="data-[state=active]:bg-blue-600">Outcomes</TabsTrigger>
            <TabsTrigger value="prerequisites" className="data-[state=active]:bg-blue-600">Prerequisites</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="space-y-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Course Description</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  This comprehensive JavaScript course will take you from beginner to confident developer. 
                  You'll learn the fundamentals of programming, modern JavaScript features, and how to build 
                  interactive web applications.
                </p>
                <p>
                  Throughout this course, you'll work on hands-on projects that will help you apply what you learn 
                  and build a portfolio of work to showcase to potential employers.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="curriculum" className="space-y-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Course Curriculum</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3, 4].map((week) => (
                  <div key={week} className="border border-gray-700 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <BookOpen className="h-4 w-4 text-blue-400" />
                      <h3 className="text-white font-semibold">Week {week}</h3>
                    </div>
                    <p className="text-gray-400 text-sm">
                      Week {week} content will be displayed here
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="outcomes" className="space-y-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Learning Outcomes</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start space-x-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Understand JavaScript fundamentals and syntax</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Work with DOM manipulation and events</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Build interactive web applications</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Understand modern JavaScript features (ES6+)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="prerequisites" className="space-y-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Prerequisites</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>Basic understanding of HTML and CSS</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>No prior programming experience required</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>A computer with internet access</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default CourseDetail;
