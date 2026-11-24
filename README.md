# Algorithm Studio

Algorithm Studio is a study guide for COMP 006 Data Structures & Algorithms. It covers chapters 2–12 with interactive walkthroughs, theory summaries, Java and pseudocode examples, and searchable slide text.

Run the site locally:

```sh
npm install
npm run dev
```

Vite prints the local URL. Choose a chapter in the sidebar, then use **Next step** in the **Lesson** tab to follow changes in the visualization and paired code. Choose a walkthrough or code example to switch both panels together. The **Code** tab gives the snippet more room, and **Source slides** lets you search the lecture notes.

Run `npm run build` to create a static build in `dist/`. Run `npm run preview` to serve that build locally. The application includes the original PDFs when they are available in `raw_lessons/`. Chapter 11 source notes were transcribed from scanned slides.
