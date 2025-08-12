"use client"

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Switch } from "./ui/switch"
import { SettingsIcon, Save, Database, Bell, Shield, Palette } from "lucide-react"

export function Settings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white flex items-center">
          <SettingsIcon className="h-8 w-8 mr-3 text-gray-400" />
          Settings
        </h1>
        <Button className="bg-green-600 hover:bg-green-700">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <SettingsIcon className="h-5 w-5 mr-2 text-blue-400" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="schoolName" className="text-gray-300">
                School Name
              </Label>
              <Input
                id="schoolName"
                defaultValue="Greenwood High School"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="adminEmail" className="text-gray-300">
                Admin Email
              </Label>
              <Input
                id="adminEmail"
                type="email"
                defaultValue="admin@greenwood.edu"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="timezone" className="text-gray-300">
                Timezone
              </Label>
              <select className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white">
                <option>UTC-5 (Eastern Time)</option>
                <option>UTC-6 (Central Time)</option>
                <option>UTC-7 (Mountain Time)</option>
                <option>UTC-8 (Pacific Time)</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Bell className="h-5 w-5 mr-2 text-yellow-400" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="emailNotifications" className="text-gray-300">
                Email Notifications
              </Label>
              <Switch id="emailNotifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="smsNotifications" className="text-gray-300">
                SMS Notifications
              </Label>
              <Switch id="smsNotifications" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="pushNotifications" className="text-gray-300">
                Push Notifications
              </Label>
              <Switch id="pushNotifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="weeklyReports" className="text-gray-300">
                Weekly Reports
              </Label>
              <Switch id="weeklyReports" defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Shield className="h-5 w-5 mr-2 text-red-400" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="twoFactor" className="text-gray-300">
                Two-Factor Authentication
              </Label>
              <Switch id="twoFactor" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="sessionTimeout" className="text-gray-300">
                Auto Session Timeout
              </Label>
              <Switch id="sessionTimeout" defaultChecked />
            </div>
            <div>
              <Label htmlFor="passwordPolicy" className="text-gray-300">
                Password Policy
              </Label>
              <select className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white">
                <option>Standard (8+ characters)</option>
                <option>Strong (12+ characters, mixed case)</option>
                <option>Very Strong (16+ characters, symbols)</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Database Settings */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Database className="h-5 w-5 mr-2 text-green-400" />
              Database & Backup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="autoBackup" className="text-gray-300">
                Automatic Backup
              </Label>
              <Switch id="autoBackup" defaultChecked />
            </div>
            <div>
              <Label htmlFor="backupFrequency" className="text-gray-300">
                Backup Frequency
              </Label>
              <select className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white">
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
              >
                Create Backup
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
              >
                Restore Backup
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Theme Settings */}
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Palette className="h-5 w-5 mr-2 text-purple-400" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-600 rounded-lg cursor-pointer hover:border-blue-500">
              <div className="w-full h-20 bg-gradient-to-br from-blue-900 to-purple-900 rounded mb-2"></div>
              <p className="text-white text-sm">Dark Blue (Current)</p>
            </div>
            <div className="p-4 border border-gray-600 rounded-lg cursor-pointer hover:border-blue-500">
              <div className="w-full h-20 bg-gradient-to-br from-gray-800 to-gray-900 rounded mb-2"></div>
              <p className="text-white text-sm">Dark Gray</p>
            </div>
            <div className="p-4 border border-gray-600 rounded-lg cursor-pointer hover:border-blue-500">
              <div className="w-full h-20 bg-gradient-to-br from-green-800 to-blue-900 rounded mb-2"></div>
              <p className="text-white text-sm">Ocean Green</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
