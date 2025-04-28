const fs = require("fs");
const path = require("path");

// Files to fix
const filesToFix = [
  {
    path: "src/components/hydration/WaterIntakeTracker.js",
    components: ["Header", "Title", "Subtitle"],
  },
  {
    path: "src/components/workout/WorkoutGenerator.js",
    components: ["Title"],
  },
  {
    path: "src/features/meals/Meals.js",
    components: ["Header", "Title", "Subtitle"],
  },
];

// Process each file
filesToFix.forEach((file) => {
  const filePath = path.join(process.cwd(), file.path);

  // Read the file
  let content = fs.readFileSync(filePath, "utf8");

  // For each component to remove
  file.components.forEach((component) => {
    // Try to find multiline styled component
    const multilineRegex = new RegExp(
      `const ${component} = styled\\.[\\s\\S]+?\`;`,
      "m"
    );
    const multilineMatch = content.match(multilineRegex);

    if (multilineMatch) {
      // Replace with a comment
      content = content.replace(
        multilineMatch[0],
        `// Removed unused styled component: ${component}`
      );
      console.log(`Removed ${component} from ${file.path}`);
    } else {
      // Try single line as fallback
      const regex = new RegExp(`const ${component} = styled\\.[^;]+;`, "s");
      const match = content.match(regex);

      if (match) {
        // Replace with a comment
        content = content.replace(
          match[0],
          `// Removed unused styled component: ${component}`
        );
        console.log(`Removed ${component} from ${file.path}`);
      } else {
        console.log(`Could not find ${component} in ${file.path}`);
      }
    }
  });

  // Write the file back
  fs.writeFileSync(filePath, content, "utf8");
});

console.log("Done fixing unused styled components!");
