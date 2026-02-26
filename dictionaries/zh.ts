import {
  RiCameraLine as CameraIcon,
  RiGamepadLine as GamepadIcon,
  RiMailLine as EnvelopeIcon,
  RiSendPlaneLine as PaperAirplaneIcon,
} from "@remixicon/react";
import {
  SiBlender,
  SiGithub,
  SiSketch,
  SiSwift,
  SiTypescript,
  SiX,
} from "@icons-pack/react-simple-icons";

import AssisChat from "../public/static/assischat.webp";
import lofyee from "../public/static/lofyee.webp";
import subnooc from "../public/static/subnooc.webp";
import youminco from "../public/static/youminco.webp";
import SparkMemosLogo from "../public/static/sparkmemos.webp";
import CassetteOneLogo from "../public/static/cassette-one.webp";
import echobellLogo from "../public/static/echobell.webp";
import raycast from "../public/images/tools/raycast.webp";
import cleanshot from "../public/images/tools/cleanshot.webp";
import orbstack from "../public/images/tools/orbstack.webp";
import tableplus from "../public/images/tools/tableplus.webp";
import httpie from "../public/images/tools/httpie.webp";
import shots from "../public/images/tools/shots.webp";
import astro from "../public/images/tools/astro.webp";
import wise from "../public/images/tools/wise.webp";
import { title } from "process";

const dictionary = {
  meta: {
    baseUrl: "https://nooc.me",
    websiteName: "Nooc 的主页",
    motto: "游离于存在与虚无间的理想主义者",
    mottos: [
      "玫瑰是没有理由的开放",
      "我们一日日度过的所谓日常，也许是接连不断发生的奇迹",
    ],
    bio: `
一个人。

男的,
喜欢看书听歌写代码。

听歌喜欢电台随机;
电影喜欢追着导演看;
看书偏爱小说，有时也看哲史;
游戏喜欢买但不爱玩。

尝试过学画画;
也买过 MIDI 键盘;
但仅此而已。

偏爱泛客户端开发;
Serverless 爱好者。
    `,
    fillKeywords(keywords?: string[]): string[] {
      return [
        "Nooc",
        "noobnooc",
        "noocink",
        "nookinc",
        "Nooc 的个人主页",
        "个人主页",
        "个人网站",
        "独立博客",
        "独立开发",
        "Bento",
        ...(keywords ?? []),
      ];
    },
  },
  urls: {
    home: "/zh",
    works: "/zh/works",
    posts: "/zh/posts",
    life: "/zh/life",
    about: "/zh/about",

    shareToX(title: string, postLink: string) {
      return `https://twitter.com/share?text=${encodeURIComponent(
        `我正在看「${title}」 @noobnooc`,
      )}&url=${encodeURIComponent(`https://nooc.me${postLink}`)}`;
    },
  },
  labels: {
    home: "主页",
    works: "作品",
    posts: "技术",
    life: "生活",
    about: "关于",
    latestPosts: "最新",
    latestTech: "技术",
    latestLife: "生活",
    noocWorks: "Nooc的作品",
    recommended: "推荐",
    activity: "活动",
    doing: "在做什么",
    playing: "在玩什么",
    contactMe: "联系我",
    toc: "目录",
    categories: "分类",
    featured: "精选",
    archive: "归档",
    shareTo: "分享到：",
    subnooc: "主观世界",
    brandName: "NOOC",
    brandTagline: "Nooc the Noob",
    notFoundStatus: "\u7eb8\u7a7a\u4e86",
    notFoundTitle: "\u6258\u76d8\u5df2\u7a7a",
    notFoundSubtitle:
      "\u8bf7\u6b63\u786e\u653e\u5165\u7eb8\u5f20\u4ee5\u6253\u5370\u5185\u5bb9\u3002",
    notFoundButton: "\u2190 \u6253\u5370\u4e3b\u9875",
    notFoundError: "ERR 404 \u00b7 PAPER_NOT_FOUND",
    printedOn: "\u6253\u5370\u4e8e",
    reading: "最近阅读",
    films: "最近观影",
    music: "最近聆听",
    suggestions: "推荐",
    aboutTitle: "关于",
    aboutSubtitle: "",
    entries(count: number) {
      return `${count} 条`;
    },
    icon(label: string) {
      return `${label}的图标`;
    },
  },
  tools: [
    {
      name: "Raycast",
      summary: "Raycast 是一款功能丰富、扩展性强的 macOS 启动器。",
      link: "https://raycast.com/?via=nooc",
      color: "orange",
      icon: raycast,
      rating: 5,
      platform: "macOS",
      pricing: "免费增值",
    },
    {
      name: "OrbStack",
      summary: "OrbStack 是一个简单轻便的运行 Docker 容器和 Linux 的工具。",
      link: "https://orbstack.dev",
      color: "indigo",
      icon: orbstack,
      rating: 5,
      platform: "macOS",
      pricing: "免费增值",
    },
    {
      name: "CleanShot",
      summary:
        "CleanShot X 提供了从截图到录屏的大部分功能，且拥有简洁美观的界面。",
      link: "https://cleanshot.sjv.io/9LxN54",
      color: "blue",
      icon: cleanshot,
      rating: 4.5,
      platform: "macOS",
      pricing: "付费",
    },
    {
      name: "Wise",
      summary:
        "Wise 是一个跨境收款/转账/支付工具，汇率比较划算且 App 界面友好。",
      link: "https://wise.com/invite/ihpc/1q2ntua",
      color: "green",
      icon: wise,
      rating: 5,
      platform: "Web, iOS, Android",
      pricing: "免费",
    },
    {
      name: "HTTPie",
      summary: "HTTPie 是一个简单直观的 HTTP 客户端。",
      link: "https://httpie.io",
      color: "green",
      icon: httpie,
      rating: 4.5,
      platform: "Desktop, Web",
      pricing: "免费",
    },
    {
      name: "Shots",
      summary: "Shots 帮助您从屏幕截图中创建精美的社交分享图。",
      link: "https://shots.so",
      color: "pink",
      icon: shots,
      rating: 4.5,
      platform: "Web",
      pricing: "免费",
    },
    {
      name: "TablePlus",
      summary: "TablePlus 是一个强大的数据库管理图形用户界面工具。",
      link: "https://tableplus.com",
      color: "yellow",
      icon: tableplus,
      rating: 4,
      platform: "Desktop, iOS",
      pricing: "免费增值",
    },
    {
      name: "Astro",
      summary: "Astro 是一款用于 App Store 优化的 ASO 关键词工具。",
      link: "https://tryastro.app?aff=kMo5R",
      color: "purple",
      icon: astro,
      rating: 3.5,
      platform: "macOS",
      pricing: "付费",
    },
  ],
  playingItems: [
    {
      name: "TypeScript",
      icon: SiTypescript,
      summary:
        "最常使用的编程语言, 常搭配使用的有 Node / React / Tailwind 等。",
      color: "blue",
    },
    {
      name: "Swift",
      icon: SiSwift,
      summary:
        "最近在学习苹果生态的程序设计, 常搭配使用的有 SwiftUI / Combine 。",
      color: "amber",
    },
    {
      name: "Sketch",
      icon: SiSketch,
      summary: "偶尔也弄弄设计, 但不太熟。现在用 Figma 比较多。",
      color: "yellow",
    },
    {
      name: "Blender",
      icon: SiBlender,
      summary: "尝试学习过很多次, 每次都是照着教程弄一遍就放弃了。",
      color: "orange",
    },
    {
      name: "Switch",
      icon: GamepadIcon,
      summary: "有一台 Switch, 但上面很多灰, 还有一台灰更多的 PS4 。",
      color: "rose",
    },
    {
      name: "摄影",
      icon: CameraIcon,
      summary: "有一台 Sony a7c, 但不知道电池还有没有电。",
      color: "cyan",
    },
  ],
  works: [
    {
      name: "回声铃",
      summary: "将 Webhook/邮件转为即时通知与电话警报",
      image: echobellLogo,
      link: "https://echobell.one",
      color: "orange",
      primary: true,
    },
    {
      name: "星火记",
      summary: "快速捕捉灵感的备忘录应用，支持多类型内容与 iCloud 同步",
      image: SparkMemosLogo,
      link: "https://sparkmemos.com",
      color: "orange",
      primary: true,
    },
    {
      name: "CassetteOne",
      summary: "一个模拟磁带机设计的复古风格白噪音和音乐播放器。",
      image: CassetteOneLogo,
      link: "https://cassette.one",
      color: "orange",
      primary: true,
    },
    {
      name: "游民CO",
      summary: "数字游民旅居社区网站",
      image: youminco,
      link: "https://youmin.co",
      color: "blue",
      primary: true,
    },
    {
      name: "AssisChat",
      summary: "ChatGPT 客户端",
      image: AssisChat,
      link: "https://assischat.com",
      color: "green",
      primary: false,
    },
    {
      name: "Lofyee",
      summary: "Lo-Fi 音乐播放器",
      image: lofyee,
      link: "https://lofyee.com",
      color: "rose",
      primary: false,
    },
    {
      name: "主观世界",
      summary: "分享我思考的博客",
      image: subnooc,
      link: "https://subnooc.com",
      color: "red",
      primary: false,
    },
    {
      name: "OhMyGPT",
      summary: "一键部署自己 ChatGPT 应用",
      link: "https://github.com/assischat/ohmygpt",
      color: "green",
      primary: false,
    },
    {
      name: "PH Summary",
      summary: "Product Hunt 每日摘要",
      link: "https://twitter.com/ph_summary",
      color: "orange",
      primary: false,
    },
  ],
  contacts: [
    {
      label: "X (Twitter)",
      name: "@noobnooc",
      link: "https://x.com/noobnooc",
      icon: SiX,
    },
    {
      label: "GitHub",
      name: "@noobnooc",
      link: "https://github.com/noobnooc",
      icon: SiGithub,
    },
    {
      label: "邮箱",
      name: "nooc@nooc.me",
      link: "mailto:nooc@nooc.me",
      icon: EnvelopeIcon,
    },
    {
      label: "Telegram",
      name: "@noobnooc",
      link: "https://t.me/noobnooc",
      icon: PaperAirplaneIcon,
    },
  ],
  postAdvertisements: [
    {
      title: "支持我",
      description:
        "「回声铃」是一款可以将 Webhook/Email 转为通知/电话的 iOS 应用。",
      icon: echobellLogo,
      link: "https://apps.apple.com/app/apple-store/id6743597198?pt=126931111&ct=Nooc&mt=8",
    },
    {
      title: "支持我",
      description:
        "「星火记」是一个简洁的短笔记应用，可以用来记录灵感、想法，或者是用于稍后阅读、读书笔记等。",
      icon: SparkMemosLogo,
      link: "https://sparkmemos.com",
    },
    {
      title: "支持我",
      description:
        "「CassetteOne」是一个模拟磁带机设计的复古风格白噪音和音乐播放器。",
      icon: CassetteOneLogo,
      link: "https://cassette.one",
    },
  ],
  archive: {
    reading: [
      {
        title: "不能承受的生命之轻",
        summary: "当存在是轻的，我们该如何面对？",
      },
      {
        title: "大师和玛格丽特",
        summary: "什么是善，什么又是恶？",
      },
      { title: "生活在别处", summary: "当诗意成为一种危险。" },
      {
        title: "那不勒斯四部曲",
        summary: "细腻、真实地描绘了两个女性朋友从小孩到老年的爱恨纠葛。",
      },
      {
        title: "卡拉马佐夫兄弟",
        summary: "如果我们用恶的方式去结束了恶，那我们还是善良的吗？",
      },
      {
        title: "涅朵奇卡",
        summary: "有的人在幻想中越走越远，最终成了幻想家。",
      },
      { title: "窄门", summary: "当信仰与世俗发生冲突。" },
      { title: "伊凡·伊利奇之死", summary: "托尔斯泰后期的一篇中篇小说。" },
      { title: "孤筏重洋", summary: "一场为了证明自己的狂野旅程。" },
      { title: "夜晚的潜水艇", summary: "一本有点博尔赫斯风格的短篇小说集。" },
      {
        title: "Make Something Wonderful",
        summary: "这本书集合了很多乔布斯生前的演讲和书信。",
      },
    ],
    films: [
      {
        title: "苦尽柑来遇见你",
        summary: "很不错的一部韩剧。",
      },
      { title: "探险活宝", summary: "看剧学英语的不二之选。" },
      { title: "宇宙探索编辑部", summary: "长路漫漫地奔赴西方取经。" },
      { title: "怪物", summary: "我最喜欢的导演之一是枝裕和的作品。" },
      { title: "辛普森一家", summary: "重新开始看这部比我还老的动画。" },
      { title: "漫长的季节", summary: "近几年看过最喜欢的国产剧。" },
      {
        title: "深海",
        summary: "童心未泯的我，真的是喜欢这种花花绿绿的画风。",
      },
    ],
    music: [
      {
        title: "落日飞车",
        summary: "Vibe 感十足的微醺乐队，vibe coding 最佳伴侣。",
      },
      {
        title: "陈婧霏",
        summary: "复古的曲调和嗓音搭配并不单调的编曲。",
      },
      {
        title: "Low Roar",
        summary: "来自冰岛的空灵孤寂的声音。",
      },
      {
        title: "刺猬乐队",
        summary: "莫名其妙地能打动我。",
      },
      {
        title: "Sufjan Stevens",
        summary: "温柔且充满故事。",
      },
      {
        title: "椅子乐团",
        summary: "柔情似水的嗓音和歌词。",
      },
    ],
    suggest: [
      {
        title: "Nooc the Noob",
        link: "https://nooc.me",
        summary: "这是我的个人网站。",
        advertisement: true,
      },
      {
        title: "游民CO",
        link: "https://youmin.co",
        summary: "我做的一个数字游民社区。",
        advertisement: true,
      },
      {
        title: "OneiAI",
        link: "https://onei.ai",
        summary: "我做的一个 AI 导航网站。",
        advertisement: true,
      },
      {
        title: "CassetteOne",
        link: "https://cassette.one",
        summary: "我做的一个复古磁带设计的音乐播放器。",
        advertisement: true,
      },
      {
        title: "星火记",
        link: "https://sparkmemos.com",
        summary: "我做的一个短笔记 App。",
        advertisement: true,
      },
      {
        title: "Echobell",
        link: "https://echobell.one",
        summary: "我做的一个通知类 App。",
        advertisement: true,
      },
      {
        title: "Dippod",
        link: "https://dippod.com",
        summary: "我正在做的一个使用播客学英语的 App。",
        advertisement: false,
      },
    ],
  },
  aboutContent: `
这里是 [Nooc](https://nooc.me) 的个人空间。

不定期更新，生活里分享作者的自言自语、读书笔记、日常牢骚，但也可能会出现其他任何内容；技术里分享作者在编程、产品相关领域的一些想法和见闻。

### 关于我

网名是 Nooc，不是一个常规的单词，也没有任何意义。正如本人一样，不是那么的常规，也不强求世俗的意义。

活跃在 [Twitter](https://twitter.com/noobnooc) ，经常在上面分享一些不经思考的内容。你也可以通过 [Telegram](https://t.me/noobnooc) 来联系到我，或者是发邮件到 [nooc@nooc.me](mailto:nooc@nooc.me) 。

因为量子力学影响，可以说我是 96 年生人，也可说我生于 1997 。是一个市面上普通的三无男性，除了梦想一无所有。还拥有一个也许永远无法完成的梦想，希望有一天能成为游民环游世界。

由于没有条件做物理意义上的木匠，但又特别喜欢「设计 -> 动手 -> 打磨 -> 完工」这一套木匠流程，所以一直称自己为数字木匠。希望有一天能在虚拟的数字世界中，做一些自己喜欢，也能博大家一笑的小物什。

最大的爱好是三天打鱼两天晒网。尝试过学画画、学做视频、学摄影、学 MIDI，但都没坚持下去。一直坚持在做的兴趣有吃饭、睡觉、看小说、写代码，希望写字也能成为其中一个。

爱好的美食有折耳根拌香菜、凉拌土豆丝、各种冷吃，以及一些光明的或者黑暗的料理。偶尔也会试毒一些自己做的各类叫不出名字的糊糊。

通常在东八区的午夜 12 点到早上 8 点间入眠。

喜欢的作家有马尔克斯、卡尔维诺、王小波、伍尔夫、村上春树、莫言、刘亮程等。还有一些仰望已久但是迟迟不敢或没来得及翻开看的作家，像是陀思妥耶夫斯基、萨拉马戈、普鲁斯特、冯内古特等。迟早有一天我要进入他们的世界。

代码的话，主要写 JavaScript/TypeScript、React/NextJS、Swift/SwiftUI 相关，偏好于 Serverless 相关技术栈。

听歌的时候喜欢随机。区分音乐类型无能综合症患者，从来分不清喜欢的音乐们都是什么类型。国内的、日本的、有人声的、纯乐器的、狂野的、安静的... 总之就是太多了，基本上是啥都听，啥都喜欢。

如果你喜欢姜文、王家卫、是枝裕和、北野武、杨德昌、黄信尧其中任何一个名字，那么我们就是朋友。

就酱～
  `,
};

export default dictionary;
