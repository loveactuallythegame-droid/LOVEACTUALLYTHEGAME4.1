'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, Heart, Search } from 'lucide-react';
import Link from 'next/link';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-center">
        <CardHeader>
          <div className="text-6xl mb-4">💔</div>
          <CardTitle className="text-2xl text-gray-900 dark:text-gray-100">
            Page Not Found
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-400">
            Looks like this page went on a break! Don't worry, your relationship journey continues.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-4xl">🔍</div>
          <p className="text-gray-700 dark:text-gray-300">
            The page you're looking for doesn't exist, but your love story does!
          </p>
          
          <div className="space-y-3 pt-4">
            <Link href="/">
              <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white">
                <Home className="w-4 h-4 mr-2" />
                Return to Dashboard
              </Button>
            </Link>
            
            <Link href="/#activities">
              <Button variant="outline" className="w-full">
                <Heart className="w-4 h-4 mr-2" />
                Browse Activities
              </Button>
            </Link>
          </div>
          
          <div className="pt-4 text-sm text-gray-500">
            <p>💕 "Love Actually... The Game"</p>
            <p>How About We DON'T Break Up?</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;