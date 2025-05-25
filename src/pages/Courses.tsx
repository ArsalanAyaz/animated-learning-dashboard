
import React from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Clock, Users } from 'lucide-react';

const Courses = () => {
  const exploreCourses = [
    {
      id: 1,
      title: "JavaScript Fundamentals",
      description: "Learn the basics of JavaScript programming",
      instructor: "John Doe",
      duration: "8 weeks",
      students: 150,
      price: "$99"
    },
    {
      id: 2,
      title: "React Development",
      description: "Build modern web applications with React",
      instructor: "Jane Smith",
      duration: "12 weeks",
      students: 120,
      price: "$149"
    }
  ];

  const enrolledCourses = [
    {
      id: 1,
      title: "HTML & CSS Mastery",
      progress: 75,
      nextLesson: "CSS Grid Layout"
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Tabs defaultValue="explore" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800">
            <TabsTrigger value="explore" className="data-[state=active]:bg-blue-600">Explore Courses</TabsTrigger>
            <TabsTrigger value="enrolled" className="data-[state=active]:bg-blue-600">My Courses</TabsTrigger>
          </TabsList>
          
          <TabsContent value="explore" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exploreCourses.map((course) => (
                <Card key={course.id} className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-white">{course.title}</CardTitle>
                    <CardDescription className="text-gray-400">{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{course.students} students</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-blue-400">{course.price}</span>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="enrolled" className="space-y-6">
            {enrolledCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledCourses.map((course) => (
                  <Card key={course.id} className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">{course.title}</CardTitle>
                      <CardDescription className="text-gray-400">
                        Progress: {course.progress}%
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-4 w-4 text-blue-400" />
                        <span className="text-gray-300 text-sm">Next: {course.nextLesson}</span>
                      </div>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        Continue Learning
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">You haven't enrolled in any courses yet.</p>
                  <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                    Explore Courses
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Courses;
