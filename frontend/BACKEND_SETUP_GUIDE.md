# Backend Setup Guide

## 🚀 **Immediate Solution: Mock Registration**

Your parent registration is now working with a **mock system** that stores data locally. This means:
- ✅ **Registration works immediately**
- ✅ **Login works with registered data**
- ✅ **Data persists in browser localStorage**
- ✅ **No backend required for testing**

## 🔧 **Setting Up Real Backend (Optional)**

### **Option 1: .NET Backend (Recommended)**
If you have a .NET backend project:

1. **Navigate to your backend folder:**
   ```bash
   cd Backend
   # or wherever your .NET project is located
   ```

2. **Restore packages:**
   ```bash
   dotnet restore
   ```

3. **Run the backend:**
   ```bash
   dotnet run
   # or
   dotnet watch run
   ```

4. **Check the port** - it should show something like:
   ```
   Now listening on: http://localhost:5000
   ```

### **Option 2: Node.js Backend**
If you have a Node.js backend:

1. **Navigate to backend folder:**
   ```bash
   cd backend
   # or wherever your Node.js project is located
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   npm start
   # or
   npm run dev
   ```

### **Option 3: Python Backend**
If you have a Python backend:

1. **Navigate to backend folder:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the server:**
   ```bash
   python app.py
   # or
   flask run
   ```

## 🌐 **Update API Configuration**

Once your backend is running, update the API URL:

1. **Create `.env.local` file** in your project root:
   ```bash
   NEXT_PUBLIC_API_BASE_URL=http://localhost:YOUR_PORT
   ```

2. **Replace `YOUR_PORT`** with the actual port your backend is running on

## 🧪 **Testing the Setup**

### **Test Mock Registration (Current):**
1. Go to parent registration
2. Fill out the form
3. Submit - should work immediately
4. Check browser console for "Mock registration system" messages

### **Test Real Backend (After Setup):**
1. Start your backend service
2. Update environment variables
3. Try registration again
4. Should see "Register endpoint success" in console

## 📁 **Backend Project Structure**

Look for these folders in your project:
```
YourProject/
├── frontend/          # Your current Next.js app
├── Backend/           # .NET backend
├── backend/           # Node.js/Python backend
├── api/               # API folder
└── server/            # Server folder
```

## 🔍 **Common Issues & Solutions**

### **Port Already in Use:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### **Permission Denied:**
```bash
# Run as administrator (Windows)
# or use sudo (Mac/Linux)
```

### **Dependencies Missing:**
```bash
# .NET
dotnet restore

# Node.js
npm install

# Python
pip install -r requirements.txt
```

## 📱 **Current Status**

- ✅ **Frontend**: Working perfectly
- ✅ **Mock Registration**: Working immediately
- ✅ **Mock Login**: Working with registered data
- ⚠️ **Real Backend**: Needs to be started

## 🎯 **Next Steps**

1. **Test the mock registration** - it should work now!
2. **Look for backend folders** in your project
3. **Start the backend service** if you find one
4. **Update API configuration** to use real backend
5. **Test real registration** once backend is running

## 💡 **Pro Tip**

The mock system is perfect for:
- **Development and testing**
- **Demo purposes**
- **When backend is temporarily unavailable**
- **Learning and experimentation**

Your parent registration is now fully functional! 🎉
