import React, { useState } from 'react';
import { Search, Heart, ShoppingCart, Menu, ChevronDown, User, Globe } from 'lucide-react';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const handleUserClick = () => {
        window.location.href = '/login';
    };
    return (
        <div className="w-full">
            {/* Desktop Header */}
            <header className="hidden md:block bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center">
                                <div className="w-3 h-3 bg-white rounded-sm"></div>
                            </div>
                            <span className="text-xl font-semibold text-gray-900">care mall</span>
                        </div>

                        {/* Navigation */}
                        <nav className="flex items-center space-x-8">
                            <div className="flex items-center space-x-1 text-gray-700 hover:text-red-500 cursor-pointer">
                                <span>Categories</span>
                                <ChevronDown className="w-4 h-4" />
                            </div>
                            <a href="#" className="text-gray-700 hover:text-red-500">New Arrivals</a>
                            <a href="#" className="text-gray-700 hover:text-red-500">Most Wanted</a>
                            <a href="#" className="text-red-500 font-medium">Become a seller</a>
                        </nav>

                        {/* Search Bar */}
                        <div className="flex-1 max-w-md mx-8">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search Products, Brands, Categories"
                                    className="w-full px-4 py-2 pl-10 pr-4 text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            </div>
                        </div>

                        {/* Right Icons */}
                        <div className="flex items-center space-x-4">
                            <Globe className="w-5 h-5 text-gray-600 hover:text-red-500 cursor-pointer" />
                            <div className="relative">
                                <Heart className="w-5 h-5 text-gray-600 hover:text-red-500 cursor-pointer" />
                            </div>
                            <div className="relative">
                                <ShoppingCart className="w-5 h-5 text-gray-600 hover:text-red-500 cursor-pointer" />
                            </div>
                            <User
                                className="w-5 h-5 text-gray-600 hover:text-red-500 cursor-pointer"
                                onClick={handleUserClick}  // Only added this onClick handler
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Header */}
            <header className="md:hidden bg-red-500">
                <div className="flex items-center justify-between px-4 py-3">
                    {/* Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="text-white"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    {/* Logo */}
                    <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                            <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
                        </div>
                        <span className="text-xl font-semibold text-white">care mall</span>
                    </div>

                    {/* Right Icons */}
                    <div className="flex items-center space-x-4">
                        <Search className="w-5 h-5 text-white" />
                        <div className="relative">
                            <Heart className="w-5 h-5 text-white" />
                        </div>
                        <div className="relative">
                            <ShoppingCart className="w-5 h-5 text-white" />
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                {isMenuOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setIsMenuOpen(false)}>
                        <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg" onClick={(e) => e.stopPropagation()}>
                            <div className="p-4">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center">
                                            <div className="w-3 h-3 bg-white rounded-sm"></div>
                                        </div>
                                        <span className="text-xl font-semibold text-gray-900">care mall</span>
                                    </div>
                                    <button onClick={() => setIsMenuOpen(false)} className="text-gray-500">
                                        ✕
                                    </button>
                                </div>

                                <nav className="space-y-4">
                                    <div className="flex items-center justify-between text-gray-700 hover:text-red-500 cursor-pointer py-2">
                                        <span>Categories</span>
                                        <ChevronDown className="w-4 h-4" />
                                    </div>
                                    <a href="#" className="block text-gray-700 hover:text-red-500 py-2">New Arrivals</a>
                                    <a href="#" className="block text-gray-700 hover:text-red-500 py-2">Most Wanted</a>
                                    <a href="#" className="block text-red-500 font-medium py-2">Become a seller</a>

                                    <div className="pt-4 border-t border-gray-200">
                                        <div className="relative mb-4">
                                            <input
                                                type="text"
                                                placeholder="Search Products, Brands, Categories"
                                                className="w-full px-4 py-2 pl-10 pr-4 text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                            />
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-200">
                                        <div className="flex items-center space-x-4">
                                            <Globe className="w-5 h-5 text-gray-600" />
                                            <User className="w-5 h-5 text-gray-600" />
                                        </div>
                                    </div>
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </header>
        </div>
    );
};

export default Navbar;