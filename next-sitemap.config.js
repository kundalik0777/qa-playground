module.exports = {
  siteUrl: "https://www.qaplayground.com/", // Replace with your site's URL
  generateRobotsTxt: true, // Generate robots.txt file
  additionalPaths: async () => [
    {
      loc: "/ads.txt",
      changefreq: "monthly",
      priority: 0.2,
    },
  ],
};
