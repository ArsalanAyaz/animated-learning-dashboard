import React from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { HelpCircle, Clock, CheckCircle, Play, BookOpen } from 'lucide-react';
import { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { Label } from '@/components/ui/label';

interface EnrolledCourse {
  id: string;
  title: string;
}

interface Quiz {
  id: string;
  title: string;
  course_id: string;
  due_date?: string;
  total_marks: number;
  questions?: number;
  time_limit?: string;
  submission?: {
    id: string;
    submitted_at: string;
    score?: number;
    total?: number;
    status?: 'graded' | 'under_review';
  };
}

const Quizzes = () => {
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [allQuizzes, setAllQuizzes] = useState<Quiz[]>([]);
  const [isLoadingEnrollments, setIsLoadingEnrollments] = useState(true);
  const [isLoadingQuizzes, setIsLoadingQuizzes] = useState(false);
  const [errorEnrollments, setErrorEnrollments] = useState<string | null>(null);
  const [errorQuizzes, setErrorQuizzes] = useState<string | null>(null);

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
    const fetchQuizzes = async () => {
      if (!selectedCourseId) return;

      try {
        setIsLoadingQuizzes(true);
        setErrorQuizzes(null);
        const data = await apiRequest(`/api/quizzes/courses/${selectedCourseId}/quizzes`);
        setAllQuizzes(data);
      } catch (err) {
        console.error('Error fetching quizzes:', err);
        setErrorQuizzes(err instanceof Error ? err.message : 'Failed to fetch quizzes');
      } finally {
        setIsLoadingQuizzes(false);
      }
    };

    fetchQuizzes();
  }, [selectedCourseId]);

  const pendingQuizzes = allQuizzes.filter(quiz => !quiz.submission);
  const submittedQuizzes = allQuizzes.filter(quiz => quiz.submission);

  const handleSelectCourse = (value: string) => {
    setSelectedCourseId(value);
  };

  const handleStartQuiz = (quizId: string) => {
    console.log(`Start quiz clicked for quiz ID: ${quizId}`);
  };

  const handleViewResults = (submissionId: string) => {
    console.log(`View results clicked for submission ID: ${submissionId}`);
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
          <Label htmlFor="course-select" className="text-gray-300">Select Course:</Label>
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
          {isLoadingQuizzes && <span className="text-gray-400">Loading quizzes...</span>}
          {errorQuizzes && <span className="text-red-400">{errorQuizzes}</span>}
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800">
            <TabsTrigger value="pending" className="data-[state=active]:bg-blue-600">
              Pending Quizzes ({pendingQuizzes.length})
            </TabsTrigger>
            <TabsTrigger value="submitted" className="data-[state=active]:bg-blue-600">
              Submitted Quizzes ({submittedQuizzes.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending" className="space-y-6">
            {isLoadingQuizzes ? (
              <div className="text-gray-400 text-center">Loading pending quizzes...</div>
            ) : pendingQuizzes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pendingQuizzes.map((quiz) => (
                  <Card key={quiz.id} className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-white">{quiz.title}</CardTitle>
                        </div>
                        <Badge variant="destructive">Pending</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2 text-gray-400">
                          <HelpCircle className="h-4 w-4" />
                          <span>{quiz.questions || 'N/A'} questions</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-400">
                          <Clock className="h-4 w-4" />
                          <span>{quiz.time_limit || 'N/A'}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2 text-gray-400">
                          <Clock className="h-4 w-4" />
                          <span>Due: {quiz.due_date ? new Date(quiz.due_date).toLocaleDateString() : 'N/A'}</span>
                        </div>
                        <div className="text-gray-400">
                          <span>Total: {quiz.total_marks || 'N/A'} marks</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                          onClick={() => handleStartQuiz(quiz.id)}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Start Quiz
                        </Button>
                        <Button
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                          onClick={() => console.log('Preview clicked for quiz ID:', quiz.id)}
                        >
                          Preview
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (allQuizzes.length > 0 && pendingQuizzes.length === 0) ? (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="text-center py-12">
                  <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">You have completed all quizzes for this course.</p>
                </CardContent>
              </Card>
            ) : allQuizzes.length === 0 && !isLoadingQuizzes && !errorQuizzes ? (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="text-center py-12">
                  <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-400">No quizzes available for this course yet.</p>
                </CardContent>
              </Card>
            ) : null}
          </TabsContent>
          
          <TabsContent value="submitted" className="space-y-6">
            {isLoadingQuizzes ? (
              <div className="text-gray-400 text-center">Loading submitted quizzes...</div>
            ) : submittedQuizzes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {submittedQuizzes.map((quiz) => (
                  <Card key={quiz.id} className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-white">{quiz.title}</CardTitle>
                        </div>
                        <Badge variant={quiz.submission?.status === 'graded' ? 'default' : 'secondary'}>
                          {quiz.submission?.status === 'graded' ? 'Graded' : 'Under Review'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2 text-gray-400">
                          <CheckCircle className="h-4 w-4" />
                          <span>Submitted: {quiz.submission?.submitted_at ? new Date(quiz.submission.submitted_at).toLocaleDateString() : 'N/A'}</span>
                        </div>
                        {quiz.submission?.status === 'graded' && quiz.submission?.score !== undefined && quiz.total_marks !== undefined && (
                          <div className="flex items-center space-x-2 text-green-400">
                            <span>{quiz.submission.score}/{quiz.total_marks} marks</span>
                          </div>
                        )}
                      </div>
                      
                      {quiz.submission?.status === 'graded' && quiz.submission?.score !== undefined && quiz.total_marks !== undefined && (
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(quiz.submission.score / quiz.total_marks) * 100}%` }}
                          ></div>
                        </div>
                      )}
                      
                      <Button
                        variant="outline"
                        className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                        onClick={() => quiz.submission?.id ? handleViewResults(quiz.submission.id) : console.log('No submission ID for view results')}
                      >
                        View Results
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (allQuizzes.length > 0 && submittedQuizzes.length === 0) ? (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">You have no submitted quizzes for this course yet.</p>
                </CardContent>
              </Card>
            ) : allQuizzes.length === 0 && !isLoadingQuizzes && !errorQuizzes ? (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">No quizzes available for this course yet.</p>
                </CardContent>
              </Card>
            ) : null}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Quizzes;
