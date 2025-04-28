const fs = require("fs");
const path = require("path");

// Files to fix
const filesToFix = [
  {
    path: "src/components/hydration/WaterIntakeTracker.js",
    fixes: [
      {
        search: /const Header = styled[\s\S]*?;/g,
        replace: "// Removed unused styled component: Header;",
      },
      {
        search: /const Title = styled[\s\S]*?;/g,
        replace: "// Removed unused styled component: Title;",
      },
      {
        search: /const Subtitle = styled[\s\S]*?;/g,
        replace: "// Removed unused styled component: Subtitle;",
      },
    ],
  },
  {
    path: "src/components/workout/WorkoutGenerator.js",
    fixes: [
      {
        search: /const Title = styled[\s\S]*?`;/g,
        replace: "// Removed unused styled component: Title;",
      },
    ],
  },
  {
    path: "src/features/meals/Meals.js",
    fixes: [
      {
        search: /const Header = styled[\s\S]*?;/g,
        replace: "// Removed unused styled component: Header;",
      },
      {
        search: /const Title = styled[\s\S]*?;/g,
        replace: "// Removed unused styled component: Title;",
      },
      {
        search: /const Subtitle = styled[\s\S]*?;/g,
        replace: "// Removed unused styled component: Subtitle;",
      },
    ],
  },
];

// Process each file
filesToFix.forEach((file) => {
  const filePath = path.join(process.cwd(), file.path);

  // Read the file
  let content = fs.readFileSync(filePath, "utf8");

  // Apply all fixes
  file.fixes.forEach((fix) => {
    content = content.replace(fix.search, fix.replace);
  });

  // Write the file back
  fs.writeFileSync(filePath, content, "utf8");
  console.log(`Fixed ${file.path}`);
});

console.log("Done fixing all issues!");
