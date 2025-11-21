// frontend/src/pages/member/AboutUs.jsx
import React from 'react';
import MemberHeader from '../../components/member/MemberHeader';
import MemberFooter from '../../components/member/MemberFooter';
import targetIcon from '../../assets/target_icon.png';
import accessibilityIcon from '../../assets/accessibility_icon.png';
import efficiencyIcon from '../../assets/efficiency_icon.png';
import studentIcon from '../../assets/student_icon.png';

export default function AboutUs() {
  return (
    <>
      <MemberHeader />
      <main className="w-full min-h-screen bg-white pt-24">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">
              About <span className="text-yellow-400">Libron</span> Online Library
            </h1>
            <p className="text-gray-700 text-lg">
              Our mission is to bridge the gap between digital discovery and physical book access.
            </p>
          </div>

          {/* Core Mission Section */}
          <div className="bg-gray-50 border-l-4 border-yellow-400 rounded-lg p-8 mb-16">
            <div className="flex items-start gap-6">
              <img src={targetIcon} alt="Target" className="w-10 h-10 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold mb-4">Our Core Mission</h2>
                <p className="text-gray-700 leading-relaxed text-base">
                  Libron was created in partnership with the E-Library to modernize the Book borrowing process. We believe that finding and borrowing a physical book should be as fast and intuitive as any online transaction. By providing real-time availability and a simple sign-in process, we ensure the community can easily access the resources they need, reducing wait times and improving catalog visibility.
                </p>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Accessibility Card */}
            <div className="border border-gray-200 rounded-lg p-8 hover:shadow-lg transition bg-white">
              <img src={accessibilityIcon} alt="Accessibility" className="w-16 h-16 mb-6 mx-auto" />
              <h3 className="text-xl font-bold text-center mb-3">Accessibility</h3>
              <p className="text-gray-700 text-center leading-relaxed">
                Making the entire catalog visible and borrowable from any device, 24/7.
              </p>
            </div>

            {/* Efficiency Card */}
            <div className="border border-gray-200 rounded-lg p-8 hover:shadow-lg transition bg-white">
              <img src={efficiencyIcon} alt="Efficiency" className="w-16 h-16 mb-6 mx-auto" />
              <h3 className="text-xl font-bold text-center mb-3">Efficiency</h3>
              <p className="text-gray-700 text-center leading-relaxed">
                Streamlining the process so you spend less time searching and more time reading.
              </p>
            </div>

            {/* Student Focus Card */}
            <div className="border border-gray-200 rounded-lg p-8 hover:shadow-lg transition bg-white">
              <img src={studentIcon} alt="Student Focus" className="w-16 h-16 mb-6 mx-auto" />
              <h3 className="text-xl font-bold text-center mb-3">Student Focus</h3>
              <p className="text-gray-700 text-center leading-relaxed">
                Serving the students with reliable and up-to-date information.
              </p>
            </div>
          </div>

          {/* Contact Section */}
          <div className="text-center border-t pt-16">
            <h2 className="text-3xl font-bold mb-4">Have a question?</h2>
            <p className="text-gray-700 text-lg">
              Contact the E-Library staff directly for assistance, collections, or general inquiries.
            </p>
          </div>
        </div>
      </main>
      <MemberFooter />
    </>
  );
}