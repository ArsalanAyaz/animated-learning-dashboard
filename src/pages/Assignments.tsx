
import React from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { FileText, Clock, CheckCircle, Upload } from 'lucide-react';

const Assignments = () => {
  const pendingAssignments = [
    {
      id: 1,
      title: "React Component Building",
      course: "React Development",
      dueDate: "2024-01-15",
      totalMarks: 100,
      description: "Create a set of reusable React components"
    },
    {
      id: 2,
      title: "JavaScript Functions Exercise",
      course: "JavaScript Fundamentals",
      dueDate: "2024-01-20",
      totalMarks: 50,
      description: "Complete the functions programming exercises"
    }
  ];

  const submittedAssignments = [
    {
      id: 3,
      title: "HTML Structure Project",
      course: "Web Development Basics",
      submittedDate: "2024-01-10",
      totalMarks: 75,
      receivedMarks: 68,
      status: "graded"
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800">
            <TabsTrigger value="pending" className="data-[state=active]:bg-blue-600">
              Pending Assignments
            </TabsTrigger>
            <TabsTrigger value="submitted" className="data-[state=active]:bg-blue-600">
              Submitted Assignments
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending" className="space-y-6">
            {pendingAssignments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pendingAssignments.map((assignment) => (
                  <Card key={assignment.id} className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-white">{assignment.title}</CardTitle>
                          <CardDescription className="text-gray-400">
                            {assignment.course}
                          </CardDescription>
                        </div>
                        <Badge variant="destructive">Pending</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-300 text-sm">{assignment.description}</p>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2 text-gray-400">
                          <Clock className="h-4 w-4" />
                          <span>Due: {assignment.dueDate}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-400">
                          <FileText className="h-4 w-4" />
                          <span>Total: {assignment.totalMarks} marks</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                          <Upload className="h-4 w-4 mr-2" />
                          Submit Assignment
                        </Button>
                        <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">No pending assignments at the moment.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="submitted" className="space-y-6">
            {submittedAssignments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {submittedAssignments.map((assignment) => (
                  <Card key={assignment.id} className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-white">{assignment.title}</CardTitle>
                          <CardDescription className="text-gray-400">
                            {assignment.course}
                          </CardDescription>
                        </div>
                        <Badge variant={assignment.status === 'graded' ? 'default' : 'secondary'}>
                          {assignment.status === 'graded' ? 'Graded' : 'Under Review'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2 text-gray-400">
                          <CheckCircle className="h-4 w-4" />
                          <span>Submitted: {assignment.submittedDate}</span>
                        </div>
                        {assignment.status === 'graded' && (
                          <div className="flex items-center space-x-2 text-green-400">
                            <span>{assignment.receivedMarks}/{assignment.totalMarks} marks</span>
                          </div>
                        )}
                      </div>
                      
                      {assignment.status === 'graded' && (
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(assignment.receivedMarks! / assignment.totalMarks) * 100}%` }}
                          ></div>
                        </div>
                      )}
                      
                      <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                        View Submission
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">No submitted assignments yet.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Assignments;
