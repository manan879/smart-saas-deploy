
import React, { useEffect } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  FileText, 
  Download, 
  CreditCard, 
  Users, 
  BarChart3, 
  ShieldCheck, 
  FileEdit, 
  Clock, 
  CheckCircle 
} from 'lucide-react';

const Features = () => {
  useEffect(() => {
    document.title = 'Features | BillFlow';
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex-1 container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">BillFlow Features</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to create professional invoices, track payments, and manage your business finances.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center mb-4">
              <FileText className="h-8 w-8 text-blue-600 mr-3" />
              <h2 className="text-xl font-semibold">Professional Invoices</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Create beautiful, professional invoices in seconds with our easy-to-use templates.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span>Multiple templates</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span>Customizable fields</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span>Company branding</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center mb-4">
              <Download className="h-8 w-8 text-blue-600 mr-3" />
              <h2 className="text-xl font-semibold">Easy Export</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Export your invoices and data in multiple formats for accounting and record-keeping.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span>PDF downloads</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span>CSV export</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span>JSON data format</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center mb-4">
              <Users className="h-8 w-8 text-blue-600 mr-3" />
              <h2 className="text-xl font-semibold">Client Management</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Keep track of your clients and their invoicing history in one place.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span>Client database</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span>Invoice history</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span>Contact information</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center mb-4">
              <BarChart3 className="h-8 w-8 text-blue-600 mr-3" />
              <h2 className="text-xl font-semibold">Dashboard Analytics</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Get insights into your business with our comprehensive dashboard analytics.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span>Invoice totals</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span>Outstanding balances</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span>Paid invoices tracking</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center mb-4">
              <CreditCard className="h-8 w-8 text-blue-600 mr-3" />
              <h2 className="text-xl font-semibold">Flexible Pricing</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Choose the plan that works best for your business needs and budget.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span>Free starter plan</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span>Affordable Pro plan</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span>Feature-rich Elite plan</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center mb-4">
              <ShieldCheck className="h-8 w-8 text-blue-600 mr-3" />
              <h2 className="text-xl font-semibold">Secure & Reliable</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Your data is always secure with our enterprise-grade security systems.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span>Data encryption</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span>Regular backups</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span>Privacy protection</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-8 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Premium Features</h2>
              <p className="text-lg text-gray-700 mb-6">
                Upgrade to our Pro or Elite plans to unlock these premium features:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <FileEdit className="h-6 w-6 text-blue-600 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Invoice Editing</h3>
                    <p className="text-gray-600">Edit invoices even after they've been created</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Clock className="h-6 w-6 text-blue-600 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Recurring Invoices</h3>
                    <p className="text-gray-600">Set up invoices to be automatically sent on a schedule</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-blue-600 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Higher Invoice Limits</h3>
                    <p className="text-gray-600">Create more invoices with our Pro and Elite plans</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border border-blue-200">
              <h3 className="text-xl font-bold mb-4 text-center">Plan Comparison</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-2 p-2 bg-gray-50 rounded">
                  <div className="font-semibold">Plan</div>
                  <div className="text-center font-semibold">Free</div>
                  <div className="text-center font-semibold">Pro</div>
                  <div className="text-center font-semibold">Elite</div>
                </div>
                <div className="grid grid-cols-4 gap-2 p-2">
                  <div className="font-semibold">Invoices</div>
                  <div className="text-center">5</div>
                  <div className="text-center">20</div>
                  <div className="text-center">50</div>
                </div>
                <div className="grid grid-cols-4 gap-2 p-2 bg-gray-50 rounded">
                  <div className="font-semibold">Edit Invoices</div>
                  <div className="text-center">❌</div>
                  <div className="text-center">✅</div>
                  <div className="text-center">✅</div>
                </div>
                <div className="grid grid-cols-4 gap-2 p-2">
                  <div className="font-semibold">Price</div>
                  <div className="text-center">$0</div>
                  <div className="text-center">$19</div>
                  <div className="text-center">$50</div>
                </div>
              </div>
              <div className="mt-6 text-center">
                <Link to="/pricing">
                  <Button>View Pricing Details</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses that trust BillFlow for their invoicing needs.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/auth">
              <Button size="lg">
                Sign Up Free
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="outline" size="lg">
                View Plans
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
