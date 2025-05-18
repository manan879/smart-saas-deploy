import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { useAuth } from '@/context/AuthContext';
import { FileText, PieChart, Users, Send, Download, ArrowRight } from 'lucide-react';

const Index = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-billflow-500 to-billflow-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Professional Invoicing Made Simple
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto">
            BillFlow helps small businesses create, send, and manage professional invoices in seconds.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to={isAuthenticated ? "/dashboard" : "/auth"}>
              <Button size="lg" className="bg-white text-billflow-600 hover:bg-gray-100">
                {isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}
              </Button>
            </Link>
            <Link to="/features">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm text-center">
              <div className="w-12 h-12 bg-billflow-100 rounded-full flex items-center justify-center text-billflow-600 mb-4 mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Create Invoice</h3>
              <p className="text-gray-600">
                Fill in your client details, add items, and set payment terms in our easy-to-use form.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm text-center">
              <div className="w-12 h-12 bg-billflow-100 rounded-full flex items-center justify-center text-billflow-600 mb-4 mx-auto">
                <Send className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Send to Client</h3>
              <p className="text-gray-600">
                Download your invoice as a professional PDF and send it to your client via email.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm text-center">
              <div className="w-12 h-12 bg-billflow-100 rounded-full flex items-center justify-center text-billflow-600 mb-4 mx-auto">
                <PieChart className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Track Payments</h3>
              <p className="text-gray-600">
                Monitor all your invoices in one place and keep track of payment status.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm text-center">
              <div className="w-12 h-12 bg-billflow-100 rounded-full flex items-center justify-center text-billflow-600 mb-4 mx-auto">
                <Download className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">4. Get Paid</h3>
              <p className="text-gray-600">
                Receive payments faster with clear, professional invoices your clients can trust.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link to={isAuthenticated ? "/create-invoice" : "/auth"}>
              <Button size="lg" className="bg-billflow-600 hover:bg-billflow-700">
                Start Creating Invoices <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Features That Make Billing Easy</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-billflow-100 rounded-full flex items-center justify-center text-billflow-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Professional Invoices</h3>
              <p className="text-gray-600">
                Create beautiful, customized invoices with your company info, logo, and payment terms.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-billflow-100 rounded-full flex items-center justify-center text-billflow-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Downloads</h3>
              <p className="text-gray-600">
                Download your invoices as PDF files to send to clients or for your records.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-billflow-100 rounded-full flex items-center justify-center text-billflow-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Client Management</h3>
              <p className="text-gray-600">
                Keep track of all your clients and their information in one secure place.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <div className="mb-4">
                <p className="font-semibold">Sarah Thompson</p>
                <p className="text-sm text-gray-500">Freelance Designer</p>
              </div>
              <p className="text-gray-600">
                "BillFlow has simplified my entire billing process. I can create and send professional invoices in minutes, which has helped me get paid faster."
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <div className="mb-4">
                <p className="font-semibold">Michael Chen</p>
                <p className="text-sm text-gray-500">Small Business Owner</p>
              </div>
              <p className="text-gray-600">
                "The invoice templates are professional and the system is so easy to use. I've saved hours each month on paperwork since switching to BillFlow."
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-billflow-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to simplify your invoicing?</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto">
            Join thousands of businesses using BillFlow for their invoicing needs.
          </p>
          <Link to={isAuthenticated ? "/dashboard" : "/auth"}>
            <Button size="lg" className="bg-white text-billflow-600 hover:bg-gray-100">
              {isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">BillFlow</h3>
              <p className="mb-4">Making invoicing simple for everyone.</p>
            </div>
            
            <div>
              <h4 className="text-white text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link to="/features" className="hover:text-white">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-white">Pricing</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="hover:text-white">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8 text-center">
            <p>&copy; {new Date().getFullYear()} BillFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
