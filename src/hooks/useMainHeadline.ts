import { useState, useEffect } from "react";

const useMainHeadline = (url: string | null) => {
  const [headline, setHeadline] = useState<string | null | undefined>(null);

  useEffect(() => {
    if (url) {
      const fetchHeadline = async () => {
        try {
          const response = await fetch(url);
          const text = await response.text();
          const parser = new DOMParser();
          const doc = parser.parseFromString(text, "text/html");
          const headings = doc.querySelectorAll("h1, h2, h3, h4, h5, h6");
          const filteredHeadings = Array.from(headings)
            .filter((heading) => {
              // Check if class or id contains 'navigat' or 'hidden'
              const hasNavigateOrHidden =
                heading.classList
                  .toString()
                  .toLowerCase()
                  .includes("navigat") ||
                (heading.id && heading.id.toLowerCase().includes("navigat")) ||
                heading.classList.toString().toLowerCase().includes("hidden") ||
                (heading.id && heading.id.toLowerCase().includes("hidden"));

              return !hasNavigateOrHidden; // Exclude headings that match the condition
            })
            .sort((a, b) => {
              const headingOrder = ["H1", "H2", "H3", "H4", "H5", "H6"];
              return (
                headingOrder.indexOf(a.tagName) -
                headingOrder.indexOf(b.tagName)
              );
            });

          let mainHeadline = null;

          const headlineDivs = doc.querySelectorAll(
            'div[class*="headline"], div[id*="headline"]'
          );

          headlineDivs.forEach((div) => {
            div.textContent && setHeadline(div.textContent.trim());
          });

          if (!headline) {
            for (const heading of filteredHeadings) {
              console.log(heading);
              if (heading.tagName === "H1") {
                console.log("H1");
                mainHeadline = heading.textContent?.trim();
                break;
              } else if (!mainHeadline && heading.tagName === "H2") {
                console.log("H2");

                mainHeadline = heading.textContent?.trim();
                break;
              }
            }

            if (!mainHeadline) {
              const titleTag = doc.querySelector("title");
              if (titleTag) {
                mainHeadline = titleTag.textContent?.trim();
              }
            }
          }
          setHeadline(mainHeadline);
        } catch (error) {
          console.error("Error fetching headline:", error);
        }
      };

      fetchHeadline();
    }
  }, [url]);

  return headline;
};

export default useMainHeadline;