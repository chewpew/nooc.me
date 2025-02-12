---
title: 使用 Velite 在 Next.js 项目中集成一个静态博客
slug: integrate-a-blog-in-nextjs-with-velite
lang: zh
date: 2024-03-17 00:00:00
updated: 2024-08-28 00:00:00
categories:
  - development
description: 在这篇文章里，我会介绍如何使用 Velite ，为使用 Next.js 搭建的网站，添加一个静态博客的功能。最终效果如本站的博客系统。

keywords:
  - Next.js 静态博客
  - Velite 使用教程
  - Velite 对比 Contentlayer
  - Contentlayer 平替
  - MDX 样式
  - 博客搭建
  - 静态博客
---

## 为什么又搭建了一个博客

是的，我又在我的个人主页上集成了一个博客系统。在这之前，我已经有了一个个人博客「[主观世界](https://subnooc.com)」，不时也会在上面发发牢骚。但我对该博客的定位一直是只分享我自己的一些心得想法，或者是读书笔记这些篇生活向的东西，从一开始就没有打算在上面发布技术折腾相关的东西，甚至一开始就决定不会在该博客中放任何图片，始终保持纯文本的状态。

但有时又还是有分享一些折腾记录的欲望，有尝试直接使用 GitHub 的 [Discussions](https://github.com/noobnooc/noobnooc/discussions) 来发布，说实话其实是够用的，该有的功能都有。但喜欢折腾的基因总是按耐不住，总是忍不住找这个方式的缺点，比如无法自定义、入口太深很难被发现、不能为自己的网站引流等等。

自然而然，这个博客应该集成到我的个人主页之中，应该要有高度的自定义能力。而且既然从 GitHub 搬出来了，那就必须得添加一些之前没有功能，于是我便实现了多语言翻译。此时如果你回到这篇文章的标题处，在下方便能看见英文和中文的切换链接。

## 为什么使用静态博客

现在搭建博客一般有两种选择，像是 Wordpress、Ghost、Typeecho 等为代表的动态博客，和 Hugo、Hexo、Jekyll 等为代表的静态博客。静态博客和动态博客一个明显的区别，就是有没有数据库之分。如果有数据库，那么就是动态博客，如果没有，那么就是静态博客。

动态博客的优点在于扩展性强、可互动、对非技术人员更友好，功能强大且丰富。缺点是难迁移、使用成本高，如果想要自己实现而不是使用现有方案，要花费的精力更是难以估量。如果想要自己部署的话，需要使用完整的服务器或是容器服务等价格高昂的基础设施来搭建。

静态博客的优点是纯粹（因为都是文件的形式）、成本低廉，但是对与非技术人员不太友好，而且因为没有数据库，需要通过一些奇技淫巧才能实现像是评论、点赞等互动。像是 GitHub Pages、Cloudflare Pages、Vercel 等各大平台都有提供免费的静态网站托管服务，而且静态网站部署在哪都一模一样，可以随时迁移，所以静态博客除了时间几乎是零成本。

我的个人主页本就托管在 Cloudflare Pages 上，暂时也不太想引入数据库这种庞然大物，而且我也不是很在意互动。所以毫不犹豫地就选择了静态博客。

## 为什么选择 Velite

[Velite](https://github.com/zce/velite) 是一个开源的 JavaScript 内容转换工具，它可以将 Markdown/MDX、 YAML 等文件，转换为类型安全的 JavaScript 数据。比如用来实现一个静态博客，可以使用它来将 Markdown 格式的文件，转换为数据，然后再在代码中将其展示出来。可能看起来有一点绕，为什么不直接使用现成的，像 [Hugo](https://gohugo.io)、[Hexo](https://hexo.io/index.html)，不都是直接将 Markdown 生成为静态网站吗。

但这两种模式有些微的区别，如果使用 Hugo、Hexo 这些工具，它们会帮你生成整个网站，而不是将其作为网站的一部分。也有一些方法能够实现将其作为现有网站的一部分，但都会显得不那么自然，不够优雅。

我是想将博客作为我个人主页的一部分，而不是作为整个主体。虽然目前这个主页没有任何的动态内容，但是为了后续有能够扩展的能力，我一开始就使用了 [Next.js](https://nextjs.org) 来开发这个网站。这时使用 Velite 这种方式就会显得很自然，博客的内容转换为数据，然后在 Next.js 中使用，将其展示出来。而且结合 MDX，还可以在文章中嵌入一些 React 组建，说不能搞一些能吸引眼球的噱头出来。

Velite 应该也不是第一个做这类工具的，有一个远比它有名的 [Contentlayer](https://contentlayer.dev) ，我的「[主观世界](https://subnooc.com)」这个博客便是使用的它。我也正是在搜索 Contentlayer 的代替品时，才找到的 Velite 。

Contentlayer 虽然有名，但它有很多问题：

- 不能很好地处理静态资源
- 维护不活跃，已经有半年多没更新
- 使用文档太简略，甚至经常 `500` 服务器错误

截止 2024 年 3 月，Contentlayer 的上一次更新是七个月前，而且翻找 GitHub PR，也能看到绝大多数 PR 都是被 Closed ，而没有被合并。说明原作者已经没有更新意愿了。甚至经常连使用文档都无法打开，更是没有办法使用了。

而且我想象中博客的文件结构，应该是一篇文章一个文件夹，文章的 Markdown 文件、不同语言的翻译、图片，甚至视频，这些和文章相关的资源都放在这同一个文件目录中，这样会比较方便整理。但 Contentlayer 似乎没法使用这样目录结构，因为它不会处理静态文件，像图片这些文件，需要自己手动放到 `public` 目录中，由 Next.js 托管，然后在 Markdown 文件中直接引用。这意味这同一篇文章的资源，要放在不同的目录之中，管理起来十分麻烦。而 Velite 支持直接将 Markdown 文件中引用到的静态文件，在构建时直接复制到 `public` 中去，这样就方便多了。而且在 Velite 的官方示例中，也使用了和我想象中一样的目录结构，也许作者也是处于同样的需求才做了这个工具。

Velite 使用 Zod 提供了数据类型检查，可以很大程度地保证类型安全，减轻维护负担。此外还提供了 `slug` 重复检测、目录生成等特性。

所以基于上面这些原因，我最终选择了使用 Velite 来为我的个人主页集成博客功能。

## 开始使用 Velite

Velite 在其[官网](https://velite.js.org/guide/quick-start)有很详细的使用文档，如果想要仔细研究它能用来做什么，以及一些具体的细节，可以直接去官网查看。我这里只简单介绍一下在 Next.js 项目中，使用 Velite 集成一个静态博客的流程。

> 我是在使用 `npx create-next-app@latest` 创建的项目中进行的后续操作，该项目使用的全默认设置，即启用了 TypeScript, TailwindCSS 和 App Router 等，具体参照 [Next.js 官方文档](https://nextjs.org/docs/getting-started/installation)。如果你的项目结构与我不一致，可以自行进行一些相关变更。

Velite 的工作流程为：

- 读取 `velite.config.js` 或 `velite.config.ts` 配置文件中的内容
- 按照配置文件中的定义，读取并处理配置文件里 `root` 所指定目录内容
- 将处理后的结果输出到配置文件里 `output` 所设置的目录
- 在 Next.js 项目中直接导入 Velite 处理后的结果，然后就可以开始进行各种操作啦

### 安装 Velite

首先，我们需要安装 Velite，然后才能正常引入 Velite 相关的配置。打开终端，执行以下命令：

```bash
# 如果使用的是其他包管理器，可以使用相应的命令
npm install velite
```

### 添加必要配置

上面提到，我们会通过 `velite.config.ts` 这个配置文件来告诉 Velite 该如何工作。那话不多说，先在项目跟目录创建一个名为 `velite.config.ts` 的文件，并填入一下内容：

```ts
// velite.config.ts

import { defineConfig } from "velite";

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
});
```

这个配置告诉了 Velite ：

- 处理 `content` 目录下的文件
- 将处理后的结果放入 `.velite` 目录
- 将引用到的图片、视频等静态资源放入 `/public/static` 目录下
- 处理过后的静态资源引用地址为 `/static/**` (因为 Next.js 会将 `public` 目录下的文件托管到网站的根目录，所以 `/public/static/**` 目录对应的地址为 `/static/**` )
- 处理后的静态资源文件名为 `[name]-[hash:6].[ext]`
- Velite 在构建之前会清理输出目录

由此我们可以看出，`.velite` 和 `public/static` 目录下的文件均由 Velite 自动生成，所以不应该让 Git 跟踪其变化，所以我们可以将这两个目录添加到 `.gitignore` 中去：

```bash
# .gitignore

# 原有的内容

# Velite
.velite
public/static
```

在 `.gitignore` 中添加这两行后，Velite 在工作时便不会影响到我们代码仓库的状态了。

这时如果我们执行 `npx velite` 命令，Velite 就会按照我们的定义开始处理文件了（因为我们没有告诉它该以何种方式处理哪些文件，所以不会进行任何处理）。但是，在开发过程中，每次都要执行 `npx velite` 难免有点繁琐，所以我们可以将处理过程集成到 Next.js 中，在执行 `next dev` 或 `next build` 的过程中，让 Velite 自动检测文件变化并处理。

要实现这个操作，我们可以在 `next.config.js` 中添加 Velite 的处理逻辑，不过因为该配置在文件根部使用了 `await` ，要将文件改为 ES Module 的形式，所以需要将 `next.config.js` 更名为 `next.config.mjs`，并将内容替换为如下配置：

```js
// next.config.mjs

const isDev = process.argv.indexOf("dev") !== -1;
const isBuild = process.argv.indexOf("build") !== -1;
if (!process.env.VELITE_STARTED && (isDev || isBuild)) {
  process.env.VELITE_STARTED = "1";
  const { build } = await import("velite");
  await build({ watch: isDev, clean: !isDev });
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;
```

> 如果在这之前你已经修改过了 Next.js 的默认配置文件，可以根据自己配置，参照以上的内容将 Velite 相关逻辑添加进去。

添加以上配置后，我们就可以像正常开发 Next.js 项目一样，不用关心 Velite 的存在了，想要使用 Velite 处理过的文件时，直接引入 `.velite` 里的内容即可。

如果我们的项目结构比较深，为了避免出现 `import {posts} from '../../../../velite'` 这种情况，可以在 TypeScript 的配置文件中添加一个便捷路径，打开项目根目录下的 `tsconfig.json` 文件，添加以下数据：

```json
{
  "compilerOptions": {
    ... Other config

    "paths": {
      "@/*": ["./*"]
    }
  }

  ... Other config
}
```

添加以上配置后，我就可以在任何地方方便地使用 `import {posts} from '@/velite'` 来引入 Velite 处理过的文件。

### 定义文件处理方式

到目前为止，我们已经完成了 Velite 的所有必要配置，但还差了最重要的一步 —— 告诉 Velite 该处理哪些文件，如何处理。

让我们回到 Velite 的配置文件 `velite.config.ts` 中，之前只添加了 `root` 和 `output` 字段，还没有告诉 Velite 我们博客内容的格式以及目录结构等。因为我们要做的是一个博客系统，所以需要定义推文（Post）和分类（Category）的结构。所以我们可以在配置文件中定义这两个类型，打开 `velite.config.ts` 文件，添加以下内容：

```ts
// velite.config.ts

import { defineCollection, defineConfig, s } from "velite";

const categories = defineCollection({
  name: "Category",
  pattern: "categories/*.yml",
  schema: s.object({
    slug: s.slug("posts", ["admin", "login"]),
    name: s.string(),
    description: s.string(),
  }),
});

const posts = defineCollection({
  name: "Post",
  pattern: "posts/**/*.md",
  schema: s.object({
    title: s.string().max(99),
    slug: s.slug(),
    date: s.isodate(),
    description: s.string().max(999).optional(),
    categories: s.array(s.string()),
    toc: s.toc(),
    content: s.markdown(),
  }),
});

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: { categories, posts },
});
```

上面的配置告诉了 Velite 我们有 `Category` 和 `Post` 的数据。

- `content/categories/` 目录下的 `*.yml` 文件会被解析成 Category 的数据，每个文件应该包含的字段为 `slug`、`name` 和 `description` ，三个字段均为字符串类型，不同的是 `slug` 会检查唯一性，而且不能是 `admin` 和 `login` 。
- `content/posts/` 目录下的 `*.md` 文件会被解析为 Post 的数据，其 Markdown 文件的头部需要包含的字段有：`title`、`slug`、`date`、`description` 和 `categories` ，它们的类型可以根据类型定义和意思推断出来。其中的 `toc` 和 `content` ，Velite 会根据 Markdown 的文件内容进行进行自动填充。

现在，我们就可以开始添加文章和类别了。假如我们有一个 `开发` 分类，可以创建一个 `content/categories/development.yml` ，并添加以下的内容：

```yml
slug: development
name: 开发
description: 分享我在编程过程中的一些折腾经历
```

然后，可以添加我们的第一篇文章，创建文件 `content/posts/hello-world.md` ，并填入以下内容：

```md
---
title: Hello, world!
slug: hello-world
date: 2024-03-17 00:00:00
categories:
  - development
---

你好呀！这是我博客的第一篇文章。
```

现在我们就可以直接从 `.velite` 目录下导入我们的分类信息和文章内容啦。

## 在 Next.js 中使用 Velite 生成的数据

经过以上的设置后，我们可以直接引入 `.velite` 目录下 Velite 所构建的数据，然后在页面中进行任意使用。

- 读取分类信息

```ts
import { categories } from "@/.velite";

export default function Page() {
  return (
    <ul>
      {categories.map((category) => (
        <li key={category.slug}>
          <a href={`/categories/${category.slug}`}>{category.name}</a>
        </li>
      ))}
    </ul>
  );
}
```

- 读取文章列表

```ts
import { posts } from "@/.velite";

export default function Page() {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.slug}>
          <a href={`/posts/${post.slug}`}>{post.title}</a>
        </li>
      ))}
    </ul>
  );
}
```

- 读取某个分类下的文章列表

```ts
import { categories, posts } from "@/.velite";

function getPostsByCategorySlug(categorySlug: string) {
  return posts.filter((post) => post.categories.includes(categorySlug));
}

export default function Page() {
  const targetCategory = categories[0];

  const filteredPosts = getPostsByCategorySlug(targetCategory.slug);

  return (
    <ul>
      {filteredPosts.map((post) => (
        <li key={post.slug}>
          <a href={`/posts/${post.slug}`}>{post.title}</a>
        </li>
      ))}
    </ul>
  );
}
```

然后我们就可以使用这些数据在界面中进行展示、链接、优化样式等。

---

Velite 还能实现很多其它功能，统计每个分了里的文章数量，为 Markdown 添加代码高亮，实现国际化等。

更多的使用方法可以参考[我这个博客的源码](https://github.com/noobnooc/nooc.me)，或者想看的人多的话，后面再写一篇文章来介绍进阶用法。
