const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

function extractMarkdownImages(markdown) {
  const regex = /!\[.*?\]\((.*?)\)/g;
  const matches = [];
  let match;
  while ((match = regex.exec(markdown)) !== null) {
    matches.push(match[1]);
  }
  return matches;
}

function slugifyFileName(filename) {
  return filename
    .replace(/\.md$/, "")
    .replace(/[^\wäöüß\d\s-]/gi, "")
    .replace(/\s+/g, "-");
}


function generateIndex() {
  const blogDir = path.resolve("./blog");
  console.log("Blog-Verzeichnis:", blogDir);

  const files = fs.readdirSync(blogDir).filter(f => f.endsWith(".md"));
  console.log("Gefundene Markdown-Dateien:", files);

  const result = files.map(file => {
    const filePath = path.join(blogDir, file);
    const content = fs.readFileSync(filePath, "utf-8");
    const { data, content: body } = matter(content);

    console.log(`Lese Datei: ${file}`);
    console.log("Frontmatter:", data);

    const images = [];

    if (data.img) {
      images.push(...(Array.isArray(data.img) ? data.img : [data.img]));
    }

    if (data.img_bloglist) {
      images.push(...(Array.isArray(data.img_bloglist) ? data.img_bloglist : [data.img_bloglist]));
    }

    images.push(...extractMarkdownImages(body));

    return {
      title: data.title || file.replace(/\.md$/, ""),
      description: data.description || "",
      date: data.date || "",
      img: [...new Set(images)],
      slug: slugifyFileName(file)
    };
  });

  const outputPath = path.resolve("index.json");
  console.log("Result zum Schreiben:", JSON.stringify(result, null, 2));

  try {
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), "utf-8");
    console.log(`✅ index.json erstellt unter: ${outputPath}`);
  } catch (err) {
    console.error("Fehler beim Schreiben von index.json:", err);
  }
}

generateIndex();
