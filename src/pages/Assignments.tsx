import React from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { FileText, Clock, CheckCircle, Upload, BookOpen } from 'lucide-react';
import { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';

interface EnrolledCourse {
  id: string;
  title: string;
}

interface Assignment {
  id: string;
  title: string;
  course_id: string;
  due_date: string;
  total_marks: number;
  description: string;
  submission?: {
    id: string;
    submitted_date: string;
    status: 'graded' | 'under_review';
    received_marks?: number;
  };
}

const Assignments = () => {
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [allAssignments, setAllAssignments] = useState<Assignment[]>([]);
  const [isLoadingEnrollments, setIsLoadingEnrollments] = useState(true);
  const [isLoadingAssignments, setIsLoadingAssignments] = useState(false);
  const [errorEnrollments, setErrorEnrollments] = useState<string | null>(null);
  const [errorAssignments, setErrorAssignments] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        setIsLoadingEnrollments(true);
        setErrorEnrollments(null);
        const data = await apiRequest('/courses/my-courses');
        setEnrolledCourses(data);
        if (data.length > 0) {
          setSelectedCourseId(data[0].id);
        }
      } catch (err) {
        console.error('Error fetching enrolled courses:', err);
        setErrorEnrollments(err instanceof Error ? err.message : 'Failed to fetch enrolled courses');
      } finally {
        setIsLoadingEnrollments(false);
      }
    };
    fetchEnrolledCourses();
  }, []);

  useEffect(() => {
    const fetchAssignments = async () => {
      if (!selectedCourseId) return;

      try {
        setIsLoadingAssignments(true);
        setErrorAssignments(null);
        const data = await apiRequest(`/api/courses/${selectedCourseId}/assignments`);
        setAllAssignments(data);
      } catch (err) {
        console.error('Error fetching assignments:', err);
        setErrorAssignments(err instanceof Error ? err.message : 'Failed to fetch assignments');
      } finally {
        setIsLoadingAssignments(false);
      }
    };

    fetchAssignments();
  }, [selectedCourseId]);

  const pendingAssignments = allAssignments.filter(assignment => !assignment.submission);
  const submittedAssignments = allAssignments.filter(assignment => assignment.submission);

  const handleSelectCourse = (value: string) => {
    setSelectedCourseId(value);
  };

  const handleSubmitAssignment = (assignmentId: string) => {
    console.log(`Submit assignment clicked for assignment ID: ${assignmentId}`);
  };

  const handleViewAssignment = (assignmentId: string) => {
    console.log(`View assignment clicked for assignment ID: ${assignmentId}`);
  };

  if (isLoadingEnrollments) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-400">Loading your courses...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (errorEnrollments) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-red-400">{errorEnrollments}</div>
        </div>
      </DashboardLayout>
    );
  }

  if (enrolledCourses.length === 0) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full text-center space-y-4 flex-col">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto" />
          <p className="text-gray-400 text-xl">You haven't enrolled in any courses yet.</p>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => navigate('/courses')}>
            Explore Courses
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <label htmlFor="course-select" className="text-gray-300">Select Course:</label>
          <Select onValueChange={handleSelectCourse} value={selectedCourseId || undefined}>
            <SelectTrigger className="w-[200px] bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="Select a course" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              {enrolledCourses.map(course => (
                <SelectItem key={course.id} value={course.id}>{course.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {isLoadingAssignments && <span className="text-gray-400">Loading assignments...</span>}
          {errorAssignments && <span className="text-red-400">{errorAssignments}</span>}
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800">
            <TabsTrigger value="pending" className="data-[state=active]:bg-blue-600">
              Pending Assignments ({pendingAssignments.length})
            </TabsTrigger>
            <TabsTrigger value="submitted" className="data-[state=active]:bg-blue-600">
              Submitted Assignments ({submittedAssignments.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending" className="space-y-6">
            {isLoadingAssignments ? (
              <div className="text-gray-400 text-center">Loading pending assignments...</div>
            ) : pendingAssignments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pendingAssignments.map((assignment) => (
                  <Card key={assignment.id} className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-white">{assignment.title}</CardTitle>
                        </div>
                        <Badge variant="destructive">Pending</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-300 text-sm">{assignment.description}</p>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2 text-gray-400">
                          <Clock className="h-4 w-4" />
                          <span>Due: {assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : 'N/A'}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-400">
                          <FileText className="h-4 w-4" />
                          <span>Total: {assignment.total_marks || 'N/A'} marks</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                          onClick={() => handleSubmitAssignment(assignment.id)}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Submit Assignment
                        </Button>
                        <Button
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                          onClick={() => handleViewAssignment(assignment.id)}
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (allAssignments.length > 0 && pendingAssignments.length === 0) ? (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">You have submitted all assignments for this course.</p>
                </CardContent>
              </Card>
            ) : allAssignments.length === 0 && !isLoadingAssignments && !errorAssignments ? (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">No assignments available for this course yet.</p>
                </CardContent>
              </Card>
            ) : null}
          </TabsContent>
          
          <TabsContent value="submitted" className="space-y-6">
            {isLoadingAssignments ? (
              <div className="text-gray-400 text-center">Loading submitted assignments...</div>
            ) : submittedAssignments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {submittedAssignments.map((assignment) => (
                  <Card key={assignment.id} className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-white">{assignment.title}</CardTitle>
                        </div>
                        <Badge variant={assignment.submission?.status === 'graded' ? 'default' : 'secondary'}>
                          {assignment.submission?.status === 'graded' ? 'Graded' : 'Under Review'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2 text-gray-400">
                          <CheckCircle className="h-4 w-4" />
                          <span>Submitted: {assignment.submission?.submitted_date ? new Date(assignment.submission.submitted_date).toLocaleDateString() : 'N/A'}</span>
                        </div>
                        {assignment.submission?.status === 'graded' && assignment.submission.received_marks !== undefined && (
                          <div className="flex items-center space-x-2 text-green-400">
                            <span>{assignment.submission.received_marks}/{assignment.total_marks || 'N/A'} marks</span>
                          </div>
                        )}
                      </div>
                      
                      {assignment.submission?.status === 'graded' && assignment.submission.received_marks !== undefined && assignment.total_marks !== undefined && (
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(assignment.submission.received_marks / assignment.total_marks) * 100}%` }}
                          ></div>
                        </div>
                      )}
                      
                      <Button
                        variant="outline"
                        className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                        onClick={() => handleViewAssignment(assignment.id)}
                      >
                        View Submission
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (allAssignments.length > 0 && submittedAssignments.length === 0) ? (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">You have no submitted assignments for this course yet.</p>
                </CardContent>
              </Card>
            ) : allAssignments.length === 0 && !isLoadingAssignments && !errorAssignments ? (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">No assignments available for this course yet.</p>
                </CardContent>
              </Card>
            ) : null}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Assignments;
