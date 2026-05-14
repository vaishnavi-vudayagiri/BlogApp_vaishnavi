import exp from "express";
import { verifyToken } from "../middlewares/VerifyToken.js";
import { ArticleModel } from "../models/ArticleModel.js";
export const userApp = exp.Router();

//GET ARTICLES (PUBLIC)
userApp.get("/articles", async (req, res) => {
  try {
    const articlesList = await ArticleModel.find({
      isArticleActive: true,
    });
    res.status(200).json({
      message: "articles",
      payload: articlesList,
    });
  } catch (err) {
    res.status(500).json({message: err.message,});
  }
});
userApp.put("/articles", verifyToken("USER", "AUTHOR", "ADMIN"), async (req, res) => {
  try {
    const { articleId, comment } = req.body;
    // find article
    const articleDocument = await ArticleModel.findOne({ _id: articleId,isArticleActive: true,});
    if (!articleDocument) {
      return res.status(404).json({message: "Article not found",});
    }
    const userId = req.user?.id;
    // push comment
    articleDocument.comments.push({user: userId,comment: comment,});
    await articleDocument.save();
    res.status(200).json({message: "Comment added successfully",payload: articleDocument,});
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});
