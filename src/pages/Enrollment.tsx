
import React from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Building, Upload } from 'lucide-react';

const Enrollment = () => {
  const { courseId } = useParams();

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Course Enrollment</CardTitle>
            <CardDescription className="text-gray-400">
              Complete your enrollment for JavaScript Fundamentals
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Course Summary */}
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">Course Summary</h3>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">JavaScript Fundamentals</span>
                <span className="text-blue-400 font-bold text-xl">$99</span>
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
                  />
                </div>
                <p className="text-gray-400 text-sm">
                  Please upload a clear image of your payment transaction receipt or screenshot.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3">
              Submit Enrollment Request
            </Button>

            <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-4">
              <p className="text-yellow-400 text-sm">
                <strong>Note:</strong> Your enrollment request will be reviewed by our administration team. 
                You will receive a confirmation email once your payment is verified and your enrollment is approved.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Enrollment;
