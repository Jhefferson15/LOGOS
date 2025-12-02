import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/user_provider.dart';

class LoginScreen extends StatelessWidget {
  const LoginScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final userProvider = Provider.of<UserProvider>(context);

    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Color(0xFF1A1A2E), Color(0xFF16213E)],
          ),
        ),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Logo Placeholder
              const Icon(
                Icons.auto_stories,
                size: 100,
                color: Colors.amber,
              ),
              const SizedBox(height: 20),
              const Text(
                'LOGOS',
                style: TextStyle(
                  fontSize: 40,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                  letterSpacing: 2,
                ),
              ),
              const Text(
                'A Jornada do Filósofo',
                style: TextStyle(
                  fontSize: 18,
                  color: Colors.white70,
                ),
              ),
              const SizedBox(height: 60),

              if (userProvider.isLoading)
                const CircularProgressIndicator(color: Colors.amber)
              else ...[
                // Google Sign In Button
                ElevatedButton.icon(
                  onPressed: () => userProvider.signIn(),
                  icon: const Icon(Icons.login),
                  label: const Text('Entrar com Google'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.white,
                    foregroundColor: Colors.black87,
                    padding: const EdgeInsets.symmetric(horizontal: 30, vertical: 15),
                    textStyle: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                ),
                const SizedBox(height: 20),
                // Mock Login Button (Dev Only)
                TextButton(
                  onPressed: () => userProvider.mockSignIn(),
                  child: const Text(
                    'Modo Desenvolvedor (Mock Login)',
                    style: TextStyle(color: Colors.white54),
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
