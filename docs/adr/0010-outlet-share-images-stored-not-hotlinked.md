# Outlet share images are stored with the Entry, never hotlinked

An Article's Card shows the image its Outlet publishes for link previews (`og:image`). We download that image once and store it with the Entry: in the repo while content is static data, and wherever the Portal keeps Entry images once it exists. Pages never load it from the Outlet. Hotlinking would add a third-party origin to every page (the `external-resources` invariant forbids that), it would break when an Outlet moves or deletes the file, and it would let Outlets see our Visitors. A stored copy also lets the build make the small sizes phones need.

We accept a copyright risk. The image belongs to the Outlet or its photographer. We use it only as a preview that links to the Outlet's own page, which is what social networks do with the same tag. Elena can replace or remove any image, and an Entry with no image shows a typographic placeholder. If an Outlet objects, we remove its images.

## Considered Options

- Hotlinking the Outlet's image URL: rejected, for the reasons above.
- No images, typographic Cards only: rejected by the Maintainer. Images make the Articles Section much easier to scan, and the design brief calls for them.
- Elena supplies every image herself: possible later per Entry, but too slow as the default for adding an Article.
