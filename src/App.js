import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import './App.css';

//Widoki panelu administatora
import Dashboard from './Dashboard/Dashboard';
import AdminLayout from './AdminView/AdminLayout';
import PostsHistory from './AdminView/PostsHistory';
import CreatePost from './AdminView/CreatePost';
import CommentsMod from './AdminView/CommentsMod';
import PostView from './AdminView/PostView';
import PostEditView from './AdminView/PostEditView';


//Widok użytkownika
import BlogList from './UserView/BlogList';
import UserLayout from './UserView/UserLayout';
import UserPostView from './UserView/PostView';
import MyRecipies from './UserView/MyRecipies';
import CreatePostUser from './UserView/CreatePost';










import Login from './Login/Login';
import Register from './Login/Register';
import Preferences from './Preferences/Preferences';
import useToken from './useToken';
import ProtectedRoute from './ProtectedRoute/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';


//TODO
//POPRAWNE WYŚWIETLANIAE POSTÓW - Panel adnimistartora
//Lista Komentarzy usuwanie komentarzy
//

function App() {
  return (
    <AuthProvider>
      <div className="wrapper">

        <BrowserRouter>
          <Routes>


            

          <Route path="/" element={<UserLayout />}>
  <Route index element={<BlogList />} />
  <Route path="post/:id" element={<UserPostView />} />
  <Route path="/my-recipies" element={<MyRecipies />} />
    <Route path="/create-recipie" element={<CreatePostUser />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />


</Route>

            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="posts" element={<PostsHistory />} />
              <Route path="create" element={<CreatePost />} />
              <Route path="comments" element={<CommentsMod />} />
              <Route path="posts/:id" element={<PostView />} />
              <Route path="posts/edit/:id" element={<PostEditView />} />
            </Route>

            <Route
              path="/preferences"
              element={
                <ProtectedRoute>
                  <Preferences />
                </ProtectedRoute>
              }
            />

            <Route path="/register" element={<Register />} />

          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;