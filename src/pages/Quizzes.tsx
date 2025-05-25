
import React from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { HelpCircle, Clock, CheckCircle, Play } from 'lucide-react';

const Quizzes = () => {
  const pendingQuizzes = [
    {
      id: 1,
      title: "CSS Flexbox Quiz",
      course: "Web Development Basics",
      dueDate: "2024-01-18",
      totalMarks: 25,
      questions: 10,
      timeLimit: "30 minutes"
    },
    {
      id: 2,
      title: "JavaScript Variables & Functions",
      course: "JavaScript Fundamentals",
      dueDate: "2024-01-22",
      totalMarks: 40,
      questions: 15,
      timeLimit: "45 minutes"
    }
  ];

  const submittedQuizzes = [
    {
      id: 3,
      title: "HTML Basics Quiz",
      course: "Web Development Basics",
      submittedDate: "2024-01-12",
      totalMarks: 20,
      receivedMarks: 18,
      status: "graded"
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800">
            <TabsTrigger value="pending" className="data-[state=active]:bg-blue-600">
              Pending Quizzes
            </TabsTrigger>
            <TabsTrigger value="submitted" className="data-[state=active]:bg-blue-600">
              Submitted Quizzes
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending" className="space-y-6">
            {pendingQuizzes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pendingQuizzes.map((quiz) => (
                  <Card key={quiz.id} className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-white">{quiz.title}</CardTitle>
                          <CardDescription className="text-gray-400">
                            {quiz.course}
                          </CardDescription>
                        </div>
                        <Badge variant="destructive">Pending</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2 text-gray-400">
                          <HelpCircle className="h-4 w-4" />
                          <span>{quiz.questions} questions</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-400">
                          <Clock className="h-4 w-4" />
                          <span>{quiz.timeLimit}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2 text-gray-400">
                          <Clock className="h-4 w-4" />
                          <span>Due: {quiz.dueDate}</span>
                        </div>
                        <div className="text-gray-400">
                          <span>Total: {quiz.totalMarks} marks</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                          <Play className="h-4 w-4 mr-2" />
                          Start Quiz
                        </Button>
                        <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                          Preview
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="text-center py-12">
                  <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">No pending quizzes at the moment.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="submitted" className="space-y-6">
            {submittedQuizzes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {submittedQuizzes.map((quiz) => (
                  <Card key={quiz.id} className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-white">{quiz.title}</CardTitle>
                          <CardDescription className="text-gray-400">
                            {quiz.course}
                          </CardDescription>
                        </div>
                        <Badge variant={quiz.status === 'graded' ? 'default' : 'secondary'}>
                          {quiz.status === 'graded' ? 'Graded' : 'Under Review'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2 text-gray-400">
                          <CheckCircle className="h-4 w-4" />
                          <span>Submitted: {quiz.submittedDate}</span>
                        </div>
                        {quiz.status === 'graded' && (
                          <div className="flex items-center space-x-2 text-green-400">
                            <span>{quiz.receivedMarks}/{quiz.totalMarks} marks</span>
                          </div>
                        )}
                      </div>
                      
                      {quiz.status === 'graded' && (
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(quiz.receivedMarks! / quiz.totalMarks) * 100}%` }}
                          ></div>
                        </div>
                      )}
                      
                      <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                        View Results
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">No submitted quizzes yet.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Quizzes;
