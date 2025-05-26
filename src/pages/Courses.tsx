import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Clock, Users, FileText, Target, ListChecks, Info } from 'lucide-react';
import { apiRequest, getTokenFromCookies } from '@/lib/api';
import { useNavigate } from 'react-router-dom';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  students: number;
  price: number;
  progress?: number;
  nextLesson?: string;
}

interface CourseDetails {
  curriculum: string;
  outcomes: string;
  prerequisites: string;
  description: string;
}

const Courses = () => {
  const navigate = useNavigate();
  const [exploreCourses, setExploreCourses] = useState<Course[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseDetails, setCourseDetails] = useState<CourseDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('explore');

  useEffect(() => {
    console.log('useEffect running, activeTab:', activeTab);
    // Always fetch explore courses on mount or activeTab change (if relevant)
    // fetchExploreCourses(); // Remove this call

    // Fetch enrolled courses only when the active tab is 'enrolled'
    if (activeTab === 'enrolled') {
      fetchEnrolledCourses();
    }

    // Add activeTab to the dependency array so useEffect reacts to tab changes
  }, [activeTab, navigate]); // Added navigate as well as it's used in fetchEnrolledCourses

  // New useEffect for initial explore courses fetch
  useEffect(() => {
    fetchExploreCourses();
  }, []); // Empty dependency array means this runs only on mount

  const fetchExploreCourses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const exploreData = await apiRequest('/courses/explore-courses');
      setExploreCourses(exploreData);
    } catch (err) {
      console.error('Error fetching explore courses:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch explore courses');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEnrolledCourses = async () => {
    const token = getTokenFromCookies();
    console.log('Fetching enrolled courses - Token:', token);

    if (!token) {
      console.warn('No token found, redirecting to login');
      navigate('/login');
      return;
    }

    try {
      setIsLoading(true);
      const enrolledData = await apiRequest('/courses/my-courses');
      setEnrolledCourses(enrolledData);
    } catch (err) {
      console.error('Error fetching enrolled courses:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch enrolled courses');
      if (err instanceof Error && err.message.includes('Session expired')) {
        console.log('Session expired detected, redirecting to login');
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    console.log('Active tab set to:', value);
    // The useEffect based on activeTab will handle fetching.
  };

  const fetchCourseDetails = async (courseId: string) => {
    try {
      const [curriculum, outcomes, prerequisites, description] = await Promise.all([
        apiRequest(`/courses/courses/${courseId}/curriculum`),
        apiRequest(`/courses/courses/${courseId}/outcomes`),
        apiRequest(`/courses/courses/${courseId}/prerequisites`),
        apiRequest(`/courses/courses/${courseId}/description`),
      ]);

      setCourseDetails({
        curriculum: curriculum.curriculum || '',
        outcomes: outcomes.outcomes || '',
        prerequisites: prerequisites.prerequisites || '',
        description: description.description || '',
      });
    } catch (err) {
      console.error('Error fetching course details:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch course details');
    }
  };

  const handleCourseClick = async (course: Course) => {
    setSelectedCourse(course);
    await fetchCourseDetails(course.id);
  };

  const handleEnroll = (courseId: string) => {
    navigate(`/enrollment/${courseId}`);
  };

  const handleContinueLearning = (courseId: string) => {
    navigate(`/course/${courseId}`);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-400">Loading courses...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-red-400">{error}</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Tabs defaultValue="explore" className="w-full" onValueChange={handleTabChange} value={activeTab}>
          <TabsList className="grid w-full grid-cols-2 bg-gray-800">
            <TabsTrigger value="explore" className="data-[state=active]:bg-blue-600">
              Explore Courses
            </TabsTrigger>
            <TabsTrigger value="enrolled" className="data-[state=active]:bg-blue-600">
              My Courses
            </TabsTrigger>
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
                      <span className="text-xl font-bold text-blue-400">${course.price}</span>
                      <Button
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleCourseClick(course)}
                      >
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
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleContinueLearning(course.id)}
                      >
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
                  <h3 className="text-xl font-semibold text-white mb-2">No Enrolled Courses</h3>
                  <p className="text-gray-400 mb-6">
                    You haven't enrolled in any courses yet. Start your learning journey by exploring our courses.
                  </p>
                  <div className="space-y-4">
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                      onClick={() => setActiveTab('explore')}
                    >
                      Explore Courses
                    </Button>
                    <p className="text-gray-500 text-sm">
                      Browse through our catalog and find the perfect course for you
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {selectedCourse && courseDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <Card className="bg-gray-800 border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="text-white">{selectedCourse.title}</CardTitle>
                <CardDescription className="text-gray-400">{selectedCourse.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="text-white font-medium flex items-center">
                      <FileText className="h-4 w-4 mr-2" /> Curriculum
                    </h3>
                    <div className="text-gray-400 text-sm whitespace-pre-line">
                      {courseDetails.curriculum}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-white font-medium flex items-center">
                      <Target className="h-4 w-4 mr-2" /> Outcomes
                    </h3>
                    <div className="text-gray-400 text-sm whitespace-pre-line">
                      {courseDetails.outcomes}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-white font-medium flex items-center">
                      <ListChecks className="h-4 w-4 mr-2" /> Prerequisites
                    </h3>
                    <div className="text-gray-400 text-sm whitespace-pre-line">
                      {courseDetails.prerequisites}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-white font-medium flex items-center">
                      <Info className="h-4 w-4 mr-2" /> Description
                    </h3>
                    <div className="text-gray-400 text-sm whitespace-pre-line">
                      {courseDetails.description}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-4">
                  <Button
                    className="bg-gray-600 hover:bg-gray-700"
                    onClick={() => setSelectedCourse(null)}
                  >
                    Close
                  </Button>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleEnroll(selectedCourse.id)}
                  >
                    Enroll Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Courses;