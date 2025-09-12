import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Types
interface User {
    id: string;
    email: string;
    name: string;
    role: "admin" | "manager" | "user";
    createdAt: Date;
    updatedAt: Date;
}

// Validation Schemas
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

const createUserSchema = z.object({
    email: z.string().email(),
    name: z.string().min(2),
    password: z.string().min(6),
    role: z.enum(["admin", "manager", "user"]).default("user"),
});

// Mock database - simplified
let users: (User & { password: string })[] = [
    {
        id: "1",
        email: "admin@timbu.com",
        name: "Admin User",
        role: "admin",
        password: bcrypt.hashSync("123456", 10),
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: "2",
        email: "manager@timbu.com",
        name: "Manager User",
        role: "manager",
        password: bcrypt.hashSync("123456", 10),
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

// GET - Listar usuários ou obter usuário por query
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("id");

        if (userId) {
            const user = users.find(u => u.id === userId);
            if (!user) {
                return NextResponse.json(
                    { success: false, message: "User not found" },
                    { status: 404 }
                );
            }
            const { password, ...userWithoutPassword } = user;
            return NextResponse.json({ success: true, data: userWithoutPassword });
        }

        // Retornar todos os usuários
        const usersWithoutPassword = users.map(({ password, ...user }) => user);
        return NextResponse.json({
            success: true,
            data: usersWithoutPassword,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to fetch users" },
            { status: 500 }
        );
    }
}

// POST - Login ou criar usuário
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { searchParams } = new URL(request.url);
        const action = searchParams.get("action") || "login";

        if (action === "login") {
            // Login
            const data = loginSchema.parse(body);
            const user = users.find(u => u.email === data.email);

            if (!user || !bcrypt.compareSync(data.password, user.password)) {
                return NextResponse.json(
                    { success: false, message: "Invalid credentials" },
                    { status: 400 }
                );
            }

            const token = jwt.sign(
                { userId: user.id, role: user.role },
                process.env.JWT_SECRET || "secret",
                { expiresIn: "24h" }
            );

            const { password, ...userWithoutPassword } = user;
            return NextResponse.json({
                success: true,
                data: { user: userWithoutPassword, token },
            });
        }

        if (action === "register") {
            // Criar usuário
            const data = createUserSchema.parse(body);
            const existingUser = users.find(u => u.email === data.email);

            if (existingUser) {
                return NextResponse.json(
                    { success: false, message: "User already exists" },
                    { status: 400 }
                );
            }

            const hashedPassword = bcrypt.hashSync(data.password, 10);
            const newUser = {
                id: Date.now().toString(),
                ...data,
                password: hashedPassword,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            users.push(newUser);
            const { password, ...userWithoutPassword } = newUser;
            return NextResponse.json({ success: true, data: userWithoutPassword }, { status: 201 });
        }

        return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Authentication failed" },
            { status: 500 }
        );
    }
}
