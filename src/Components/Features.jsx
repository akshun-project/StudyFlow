import React from 'react';
export default function Features() {
    return (
        <>
            <h1 className="text-3xl font-semibold text-center mt-4">
                Powerful StudyFlow Features
            </h1>

            <p className="text-sm text-slate-500 text-center mt-2 max-w-md mx-auto">
                Tools designed to help students plan smarter, stay consistent, and achieve better study outcomes.
            </p>

            <div className="flex items-center justify-center flex-wrap gap-6 mt-20 px-4 md:px-0">

                {/* Feature 1 */}
                <div className="flex flex-col text-center items-center justify-center rounded-xl p-6 border border-violet-200 gap-6 max-w-sm">
                    <div className="p-6 aspect-square bg-violet-100 rounded-full flex items-center justify-center">
                        {/* Study Planning Icon */}
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                            <path 
                                d="M4 6H20M4 12H20M4 18H14" 
                                stroke="#7F22FE" 
                                strokeWidth="2" 
                                strokeLinecap="round"
                            />
                        </svg>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-base font-semibold text-slate-700">Smart Study Planner</h3>
                        <p className="text-sm text-slate-600">
                            Create daily or weekly study plans that keep you organized and focused.
                        </p>
                    </div>
                </div>

                {/* Feature 2 */}
                <div className="flex flex-col text-center items-center justify-center rounded-xl p-6 border border-green-200 gap-6 max-w-sm">
                    <div className="p-6 aspect-square bg-green-100 rounded-full flex items-center justify-center">
                        {/* Progress Tracking Icon */}
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                            <path 
                                d="M5 12l4 4L19 6" 
                                stroke="#00A63E" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-base font-semibold text-slate-700">Progress Tracking</h3>
                        <p className="text-sm text-slate-600">
                            Track completed tasks, subjects, chapters, and improve your study consistency.
                        </p>
                    </div>
                </div>

                {/* Feature 3 */}
                <div className="flex flex-col text-center items-center justify-center rounded-xl p-6 border border-orange-200 gap-6 max-w-sm">
                    <div className="p-6 aspect-square bg-orange-100 rounded-full flex items-center justify-center">
                        {/* Reminder Icon */}
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                            <path 
                                d="M12 8v4l2.5 2.5M12 1a9 9 0 1 0 9 9" 
                                stroke="#F54900"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-base font-semibold text-slate-700">Smart Reminders</h3>
                        <p className="text-sm text-slate-600">
                            Never miss a study session again with automatic reminders and notifications.
                        </p>
                    </div>
                </div>

            </div>
        </>
    );
}
