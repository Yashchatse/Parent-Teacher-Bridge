"use client"

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Progress } from "./ui/progress"
import { Badge } from "./ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts"
import { TrendingUp, TrendingDown, Users, GraduationCap, BookOpen, Calendar, Award, Target } from "lucide-react"

// Sample data for charts
const enrollmentData = [
  { month: "Jan", students: 420, teachers: 22 },
  { month: "Feb", students: 435, teachers: 23 },
  { month: "Mar", students: 448, teachers: 24 },
  { month: "Apr", students: 456, teachers: 24 },
  { month: "May", students: 465, teachers: 25 },
  { month: "Jun", students: 478, teachers: 26 },
]

const gradeDistribution = [
  { grade: "Grade 1-2", students: 85, color: "#3b82f6" },
  { grade: "Grade 3-5", students: 120, color: "#10b981" },
  { grade: "Grade 6-8", students: 135, color: "#f59e0b" },
  { grade: "Grade 9-10", students: 95, color: "#ef4444" },
  { grade: "Grade 11-12", students: 65, color: "#8b5cf6" },
]

const subjectPerformance = [
  { subject: "Math", average: 85, students: 456 },
  { subject: "Science", average: 78, students: 445 },
  { subject: "English", average: 82, students: 456 },
  { subject: "History", average: 76, students: 420 },
  { subject: "Geography", average: 80, students: 380 },
  { subject: "Computer", average: 88, students: 320 },
]

const attendanceData = [
  { day: "Mon", attendance: 94 },
  { day: "Tue", attendance: 96 },
  { day: "Wed", attendance: 92 },
  { day: "Thu", attendance: 95 },
  { day: "Fri", attendance: 89 },
  { day: "Sat", attendance: 87 },
]

const teacherWorkload = [
  { teacher: "Dr. Alice Cooper", classes: 8, students: 240, subjects: 2 },
  { teacher: "Prof. Bob Martinez", classes: 6, students: 180, subjects: 1 },
  { teacher: "Ms. Carol White", classes: 10, students: 300, subjects: 3 },
  { teacher: "Mr. David Lee", classes: 7, students: 210, subjects: 2 },
  { teacher: "Mrs. Emma Thompson", classes: 5, students: 150, subjects: 1 },
]

const performanceMetrics = [
  {
    title: "Overall Attendance Rate",
    value: "94.2%",
    change: "+2.1%",
    trend: "up",
    icon: Users,
    color: "text-green-400",
  },
  {
    title: "Average Grade Performance",
    value: "81.5%",
    change: "+3.2%",
    trend: "up",
    icon: Award,
    color: "text-blue-400",
  },
  {
    title: "Teacher Satisfaction",
    value: "87%",
    change: "-1.5%",
    trend: "down",
    icon: GraduationCap,
    color: "text-yellow-400",
  },
  {
    title: "Course Completion Rate",
    value: "92.8%",
    change: "+4.1%",
    trend: "up",
    icon: Target,
    color: "text-purple-400",
  },
]

export function AnalyticsCharts() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Analytics & Performance Metrics</h2>
        <div className="flex space-x-2">
          <select className="p-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm">
            <option>Last 30 Days</option>
            <option>Last 3 Months</option>
            <option>Last 6 Months</option>
            <option>Last Year</option>
          </select>
        </div>
      </div>

      {/* Performance Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {performanceMetrics.map((metric, index) => {
          const Icon = metric.icon
          return (
            <Card key={index} className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">{metric.title}</p>
                    <p className="text-2xl font-bold text-white">{metric.value}</p>
                    <div className="flex items-center mt-1">
                      {metric.trend === "up" ? (
                        <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-400 mr-1" />
                      )}
                      <span className={`text-sm ${metric.trend === "up" ? "text-green-400" : "text-red-400"}`}>
                        {metric.change}
                      </span>
                    </div>
                  </div>
                  <Icon className={`h-8 w-8 ${metric.color}`} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment Trends */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-400" />
              Enrollment Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={enrollmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="students"
                  stackId="1"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="teachers"
                  stackId="2"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Grade Distribution */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Users className="h-5 w-5 mr-2 text-purple-400" />
              Student Distribution by Grade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={gradeDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="students"
                  label={({ grade, students }) => `${grade}: ${students}`}
                >
                  {gradeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Performance */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-green-400" />
              Subject Performance Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={subjectPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="subject" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="average" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Attendance */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-yellow-400" />
              Weekly Attendance Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" domain={[80, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="attendance"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{ fill: "#f59e0b", strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Teacher Workload Analysis */}
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <GraduationCap className="h-5 w-5 mr-2 text-indigo-400" />
            Teacher Workload Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teacherWorkload.map((teacher, index) => (
              <div key={index} className="p-4 bg-gray-700/50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-white font-medium">{teacher.teacher}</h4>
                  <div className="flex space-x-2">
                    <Badge variant="outline" className="border-blue-500 text-blue-400">
                      {teacher.classes} Classes
                    </Badge>
                    <Badge variant="outline" className="border-green-500 text-green-400">
                      {teacher.students} Students
                    </Badge>
                    <Badge variant="outline" className="border-purple-500 text-purple-400">
                      {teacher.subjects} Subjects
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Workload Capacity</span>
                    <span className="text-white">{Math.round((teacher.students / 300) * 100)}%</span>
                  </div>
                  <Progress value={(teacher.students / 300) * 100} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Performance Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white text-lg">Top Performing Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { class: "Grade 10-A", score: 92, students: 35 },
                { class: "Grade 9-B", score: 89, students: 32 },
                { class: "Grade 11-A", score: 87, students: 28 },
                { class: "Grade 8-C", score: 85, students: 30 },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{item.class}</p>
                    <p className="text-sm text-gray-400">{item.students} students</p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-bold">{item.score}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white text-lg">Recent Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { achievement: "Science Fair Winner", class: "Grade 8-C", date: "2 days ago" },
                { achievement: "Math Olympiad Gold", class: "Grade 10-A", date: "1 week ago" },
                { achievement: "Debate Competition", class: "Grade 11-A", date: "2 weeks ago" },
                { achievement: "Art Exhibition", class: "Grade 9-B", date: "3 weeks ago" },
              ].map((item, index) => (
                <div key={index} className="border-l-4 border-yellow-400 pl-3">
                  <p className="text-white font-medium">{item.achievement}</p>
                  <p className="text-sm text-gray-400">
                    {item.class} • {item.date}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white text-lg">Areas for Improvement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { area: "Mathematics", score: 72, trend: "down" },
                { area: "Physics", score: 75, trend: "stable" },
                { area: "Chemistry", score: 78, trend: "up" },
                { area: "History", score: 74, trend: "down" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{item.area}</p>
                    <div className="flex items-center mt-1">
                      {item.trend === "up" ? (
                        <TrendingUp className="h-3 w-3 text-green-400 mr-1" />
                      ) : item.trend === "down" ? (
                        <TrendingDown className="h-3 w-3 text-red-400 mr-1" />
                      ) : (
                        <div className="h-3 w-3 bg-gray-400 rounded-full mr-1" />
                      )}
                      <span className="text-xs text-gray-400">
                        {item.trend === "up" ? "Improving" : item.trend === "down" ? "Declining" : "Stable"}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-orange-400 font-bold">{item.score}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
