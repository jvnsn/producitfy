import { request, type Request, type Response } from "express";
import * as queries from "../db/queries"
import { getAuth } from "@clerk/express";
import { uuid } from "drizzle-orm/gel-core";

export const createComment = async (req: Request<{ productId: string }>, res: Response) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) return res.status(401).json({ error: "Unauthorized"});

        const { content } = req.body;
        const { productId } = req.params;

        if (!content) {
            res.status(400).json({ error: "Comment content are required" });
            return;
        }
        
        const product = await queries.getProductById(productId);
        if (!product) return res.status(404).json({ error: "Product not found" });

        const comment = await queries.createComment({
            content,
            userId,
            productId,
        });
        res.status(201).json(comment);
    } catch (error) {
        console.error("Error creating comment:", error);
        res.status(500).json({ error: "Failed to create comment" });
    }
};

export const deleteComment = async (req: Request<{ commentId: string }>, res: Response) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) return res.status(401).json({ error: "Unauthorized"});

        const { commentId } = req.params;
        const existingComment = await queries.getCommentById(commentId);
        if (!existingComment) {
            res.status(404).json({ error: "Comment not found" });
            return;
        }

        if (existingComment.userId !== userId) {
            res.status(403).json({ error: "You can only delete your own comment"});
            return;
        }

        await queries.deleteComment(commentId);
        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).json({ error: "Failed to delete comment" });
    }
};