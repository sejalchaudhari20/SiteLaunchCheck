import Link from 'next/link';
import { AlertCircle, ArrowLeft } from 'lucide-react';

interface AuditErrorProps {
  message: string;
}

export default function AuditError({ message }: AuditErrorProps) {
  // Try to clean up technical errors for the user
  let displayMessage = message;
  let title = "Audit Failed";

  if (message.includes('fetch') || message.includes('unreachable') || message.includes('ECONNREFUSED')) {
    title = "Website Unreachable";
    displayMessage = "We couldn't connect to the website. Please check the URL and ensure the site is publicly accessible.";
  } else if (message.includes('timeout')) {
    title = "Audit Timeout";
    displayMessage = "The website took too long to respond. The page might be very large or the server is slow.";
  } else if (message.includes('Invalid URL')) {
    title = "Invalid URL";
    displayMessage = "The URL provided does not seem to be a valid website address.";
  }

  return (
    <div className="bg-gray-50 flex items-center justify-center p-4 h-full min-h-[calc(100vh-64px)]">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-lg w-full text-center">
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={32} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-600 mb-8 leading-relaxed">{displayMessage}</p>
        
        <Link 
          href="/" 
          className="inline-flex items-center justify-center space-x-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors w-full"
        >
          <ArrowLeft size={18} />
          <span>Return to Homepage</span>
        </Link>
      </div>
    </div>
  );
}
