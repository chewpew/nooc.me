import categoriesJson from "@/.velite/categories.json";
import tagsJson from "@/.velite/tags.json";
import postsJson from "@/.velite/posts.json";
import lifeCategoriesJson from "@/.velite/lifeCategories.json";
import lifePostsJson from "@/.velite/lifePosts.json";
import type { Category, Tag, Post, LifeCategory, LifePost } from "@/.velite";

export const categories = categoriesJson as Category[];
export const tags = tagsJson as Tag[];
export const posts = postsJson as Post[];
export const lifeCategories = lifeCategoriesJson as LifeCategory[];
export const lifePosts = lifePostsJson as LifePost[];
