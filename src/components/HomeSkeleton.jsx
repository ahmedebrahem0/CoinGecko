import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const HomeSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Skeleton */}
      <div className="mb-8">
        <Skeleton height={40} width={400} className="mb-2" />
        <Skeleton height={24} width={500} />
      </div>

      {/* Global Stats Cards Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Market Cap/Volume Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <Skeleton height={24} width={150} className="mb-4" />
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Skeleton height={20} width={80} />
              <Skeleton height={20} width={100} />
            </div>
            <div className="flex justify-between items-center">
              <Skeleton height={20} width={80} />
              <Skeleton height={20} width={100} />
            </div>
          </div>
          <div className="mt-4">
            <Skeleton height={32} width={130} />
          </div>
        </div>

        {/* Trending Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <Skeleton height={24} width={100} className="mb-4" />
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center space-x-3">
                <Skeleton height={24} width={24} circle />
                <div className="flex-1">
                  <Skeleton height={16} width={80} className="mb-1" />
                  <Skeleton height={14} width={60} />
                </div>
                <Skeleton height={16} width={50} />
              </div>
            ))}
          </div>
        </div>

        {/* Top Gainers Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <Skeleton height={24} width={120} className="mb-4" />
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center space-x-3">
                <Skeleton height={24} width={24} circle />
                <div className="flex-1">
                  <Skeleton height={16} width={80} className="mb-1" />
                  <Skeleton height={14} width={60} />
                </div>
                <Skeleton height={16} width={50} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Coins Section Skeleton */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <Skeleton height={32} width={200} className="mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <Skeleton height={32} width={32} circle />
                <div>
                  <Skeleton height={18} width={100} className="mb-1" />
                  <Skeleton height={14} width={60} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton height={16} width={60} />
                  <Skeleton height={16} width={50} />
                </div>
                <div className="flex justify-between">
                  <Skeleton height={16} width={80} />
                  <Skeleton height={16} width={40} />
                </div>
              </div>
              <div className="mt-3">
                <Skeleton height={30} width={100} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeSkeleton; 