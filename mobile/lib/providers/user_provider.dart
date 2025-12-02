import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import '../models/user_model.dart';
import '../services/auth_service.dart';

class UserProvider with ChangeNotifier {
  UserModel? _user;
  final AuthService _authService = AuthService();
  bool _isLoading = false;

  UserModel? get user => _user;
  bool get isLoading => _isLoading;
  bool get isLoggedIn => _user != null;

  // Initialize provider (load data if auth exists)
  Future<void> init() async {
    _isLoading = true;
    notifyListeners();

    // Check if user is already logged in via Firebase
    final firebaseUser = _authService.currentUser;
    if (firebaseUser != null) {
      await _loadUserData(firebaseUser.uid);
    } else {
      // Check local storage for cached user (optional, or just stay logged out)
      // For now, we rely on Firebase Auth state
      _isLoading = false;
      notifyListeners();
    }
  }

  // Sign in
  Future<void> signIn() async {
    try {
      _isLoading = true;
      notifyListeners();

      final user = await _authService.signInWithGoogle();
      if (user != null) {
        await _loadUserData(user.uid);
      }
    } catch (e) {
      print('Login failed: $e');
      // Handle error
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Mock Sign In
  Future<void> mockSignIn() async {
    _isLoading = true;
    notifyListeners();
    await Future.delayed(const Duration(seconds: 1));
    
    // Create a default user
    _user = UserModel(playerName: 'Mock User');
    await _saveLocalUserData();
    
    _isLoading = false;
    notifyListeners();
  }

  // Sign out
  Future<void> signOut() async {
    await _authService.signOut();
    _user = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('user_data');
    notifyListeners();
  }

  // Load user data (simulating Firestore fetch with local storage fallback)
  Future<void> _loadUserData(String uid) async {
    final prefs = await SharedPreferences.getInstance();
    final userDataString = prefs.getString('user_data');

    if (userDataString != null) {
      try {
        final Map<String, dynamic> json = jsonDecode(userDataString);
        _user = UserModel.fromJson(json);
      } catch (e) {
        print('Error parsing local user data: $e');
        _user = UserModel(playerName: 'New User'); // Fallback
      }
    } else {
      // New user or no local data
      _user = UserModel(playerName: 'Sábio Viajante');
      await _saveLocalUserData();
    }
  }

  // Save user data locally
  Future<void> _saveLocalUserData() async {
    if (_user == null) return;
    final prefs = await SharedPreferences.getInstance();
    final String json = jsonEncode(_user!.toJson());
    await prefs.setString('user_data', json);
  }
}
