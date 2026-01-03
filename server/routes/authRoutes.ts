import type { Express, Request, Response } from "express";
import bcrypt from "bcrypt";
import { generateToken, authMiddleware } from "../middleware/authMiddleware";
import { storage } from "../storage";

export async function registerAuthRoutes(app: Express) {
  // ✅ Registro de usuário
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const { email, password, name } = req.body;

      if (!email || !password || !name) {
        return res.status(400).json({ error: "Email, senha e nome são obrigatórios" });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Email inválido" });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: "Senha deve ter no mínimo 6 caracteres" });
      }

      const existingUser = await storage.getUserByUsername(email);
      if (existingUser) {
        return res.status(409).json({ error: "Email já cadastrado" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await storage.createUser({
        username: email,
        password: hashedPassword,
      });

      if (newUser) {
        await storage.updateUserProfile(newUser.id, { email, name });
      }

      const token = generateToken(newUser.id, email, name);

      res.status(201).json({
        message: "Conta criada com sucesso",
        token,
        user: {
          id: newUser.id,
          email,
          name,
        },
      });
    } catch (error) {
      console.error("Register error:", error);
      res.status(500).json({ error: "Erro ao criar conta" });
    }
  });

  // ✅ Login
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email e senha são obrigatórios" });
      }

      const user = await storage.getUserByUsername(email);

      if (!user || !user.password) {
        return res.status(401).json({ error: "Email ou senha inválidos" });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: "Email ou senha inválidos" });
      }

      console.log("✅ Login successful for user:", email);

      const token = generateToken(user.id, user.email || email, user.name || undefined);

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email || email,
          name: user.name,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Erro ao fazer login" });
    }
  });

  // ✅ Verificação de acesso baseada em créditos
  app.get("/api/auth/check-access", authMiddleware, async (req: Request, res: Response) => {
    try {
      const user = await storage.getUser(req.user!.id);
      if (!user || !user.email) {
        return res.json({ credits: 0, hasAccess: false });
      }

      const credits = await storage.getUserCredits(user.id);
      const currentCredits = credits ? credits.credits : 0;
      const hasAccess = currentCredits > 0;

      console.log(`🔎 User ${user.email} tem ${currentCredits} créditos`);

      res.json({
        credits: currentCredits,
        hasAccess,
      });
    } catch (error) {
      console.error("Check access error:", error);
      res.status(500).json({ error: "Erro ao verificar acesso" });
    }
  });

  // ✅ Atualizar avatar
  app.post("/api/auth/update-avatar", authMiddleware, async (req: Request, res: Response) => {
    try {
      const { avatar } = req.body;

      if (!avatar) {
        return res.status(400).json({ error: "Avatar é obrigatório" });
      }

      const updatedUser = await storage.updateUserAvatar(req.user!.id, avatar);
      if (!updatedUser) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      res.json({ user: updatedUser });
    } catch (error) {
      console.error("Avatar update error:", error);
      res.status(500).json({ error: "Erro ao atualizar avatar" });
    }
  });

  // ✅ Atualizar perfil
  app.post("/api/auth/update-profile", authMiddleware, async (req: Request, res: Response) => {
    try {
      const { name, email } = req.body;

      if (!name || !email) {
        return res.status(400).json({ error: "Nome e email são obrigatórios" });
      }

      const updatedUser = await storage.updateUserProfile(req.user!.id, { name, email });
      if (!updatedUser) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      res.json({ user: updatedUser });
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(500).json({ error: "Erro ao atualizar perfil" });
    }
  });

  // ✅ Alterar senha
  app.post("/api/auth/change-password", authMiddleware, async (req: Request, res: Response) => {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: "Senha atual e nova senha são obrigatórias" });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ error: "Nova senha deve ter no mínimo 6 caracteres" });
      }

      const user = await storage.getUser(req.user!.id);
      if (!user || !user.password) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      const passwordMatch = await bcrypt.compare(currentPassword, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: "Senha atual incorreta" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const updated = await storage.updateUserPassword(req.user!.id, hashedPassword);

      if (!updated) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      res.json({ success: true, message: "Senha alterada com sucesso" });
    } catch (error) {
      console.error("Password change error:", error);
      res.status(500).json({ error: "Erro ao alterar senha" });
    }
  });
}
