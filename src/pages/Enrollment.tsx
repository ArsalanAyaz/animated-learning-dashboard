import React from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Building, Upload } from 'lucide-react';
import { apiRequest } from '@/lib/api';
import { useState, useEffect } from 'react';

// Define a type for course details on the enrollment page
interface EnrollmentCourseDetails {
  title: string;
  price: number;
  description?: string; // Assuming description might be useful
}

const Enrollment = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [courseDetails, setCourseDetails] = useState<EnrollmentCourseDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [enrollmentStatus, setEnrollmentStatus] = useState<'pending' | 'approved' | 'rejected' | null>(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!courseId) {
        setError('Course ID is missing.');
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        setError(null);
        const data = await apiRequest(`/courses/explore-courses/${courseId}`);
        setCourseDetails({
          title: data.title || 'N/A',
          price: data.price || 0,
          description: data.description || '',
        });
      } catch (err) {
        console.error('Error fetching course details for enrollment:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch course details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]); // Refetch when courseId changes

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleSubmitPaymentProof = async () => {
    if (!selectedFile || !courseId) {
      setError('Please select a payment proof file.');
      return;
    }

    setIsSubmitting(true);
    setSubmissionStatus('pending');
    setError(null);

    // --- Placeholder for actual API call ---
    // You will need to implement a backend endpoint to handle file uploads
    // and associate the payment proof with the user's enrollment request.
    // This is a simulated async operation.
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate a successful submission response
      // In a real app, the backend would process the file and return a confirmation
      console.log('Simulating successful payment proof submission.', selectedFile);

      setSubmissionStatus('success');
      setEnrollmentStatus('pending'); // Set initial status as pending review
      // Optionally clear the selected file: setSelectedFile(null);

    } catch (err) {
      console.error('Simulated payment proof submission failed:', err);
      setSubmissionStatus('error');
      setError('Failed to submit payment proof. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
    // --- End of Placeholder ---

    // Example of how you might use apiRequest with a file (requires backend support for file uploads)
    // const formData = new FormData();
    // formData.append('paymentProof', selectedFile);
    // try {
    //   const response = await apiRequest(`/enrollments/${courseId}/submit-payment`, {
    //     method: 'POST',
    //     body: formData,
    //     // Do NOT set Content-Type header for FormData, the browser does it automatically
    //     headers: {
    //        // Remove 'Content-Type': 'application/json', if it's there
    //     }
    //   });
    //   setSubmissionStatus('success');
    //   setEnrollmentStatus(response.status); // Assuming backend returns the status
    // } catch (err) {
    //   setSubmissionStatus('error');
    //   setError('Submission failed.');
    // }

  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-400">Loading course details...</div>
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

  if (!courseDetails) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-400">Course details not found.</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Course Enrollment</CardTitle>
            <CardDescription className="text-gray-400">
              Complete your enrollment for {courseDetails.title}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Course Summary */}
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">Course Summary</h3>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">{courseDetails.title}</span>
                <span className="text-blue-400 font-bold text-xl">${courseDetails.price}</span>
              </div>
            </div>

            {/* Bank Account Information */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold flex items-center space-x-2">
                <Building className="h-5 w-5" />
                <span>Bank Account Details</span>
              </h3>
              <div className="bg-gray-700 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Bank Name</Label>
                    <p className="text-white font-medium">HBKL Bank</p>
                  </div>
                  <div>
                    <Label className="text-gray-300">Account Name</Label>
                    <p className="text-white font-medium">EduTech LMS</p>
                  </div>
                </div>
                <div>
                  <Label className="text-gray-300">Account Number</Label>
                  <p className="text-white font-medium">3333333333</p>
                </div>
              </div>
            </div>

            {/* Payment Proof Upload */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>Upload Payment Proof</span>
              </h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="payment-proof" className="text-gray-300">
                    Transaction Screenshot or Receipt
                  </Label>
                  <Input
                    id="payment-proof"
                    type="file"
                    accept="image/*"
                    className="bg-gray-700 border-gray-600 text-white file:bg-blue-600 file:text-white file:border-0 file:rounded file:px-4 file:py-2"
                    onChange={handleFileChange}
                  />
                  {selectedFile && <p className="text-gray-400 text-sm mt-2">Selected file: {selectedFile.name}</p>}
                </div>
                <p className="text-gray-400 text-sm">
                  Please upload a clear image of your payment transaction receipt or screenshot.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3"
              onClick={handleSubmitPaymentProof}
              disabled={isSubmitting || !selectedFile}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Enrollment Request'}
            </Button>

            {/* Submission Status and Note (Conditionally Rendered) */}
            {(submissionStatus === 'success' || submissionStatus === 'error') && (
              <div className={`rounded-lg p-4 ${submissionStatus === 'success' ? 'bg-green-900/20 border border-green-600 text-green-400' : 'bg-red-900/20 border border-red-600 text-red-400'}`}>
                {submissionStatus === 'success' ? (
                  <div className="space-y-2">
                    <p className="font-semibold">Submission Successful!</p>
                    <p className="text-sm">
                      Your payment proof has been submitted. Your enrollment request is now under review.
                    </p>
                    {enrollmentStatus && (
                      <p className="text-sm"><strong>Enrollment Status:</strong> {enrollmentStatus.charAt(0).toUpperCase() + enrollmentStatus.slice(1)}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm font-semibold">{error || 'Submission failed.'}</p>
                )}

                {/* Original Note (Conditionally Rendered after success) */}
                {submissionStatus === 'success' && (
                  <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-4 mt-4">
                    <p className="text-yellow-400 text-sm">
                      <strong>Note:</strong> Your enrollment request will be reviewed by our administration team.
                      You will receive a confirmation email once your payment is verified and your enrollment is approved.
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Enrollment;
