# Photos are resized in Elena's browser before upload

Supabase's free plan offers 1 GB of storage and no server-side image transformation. Uploading originals would fill storage after a few hundred photos, so the Portal shrinks each photo (max 2560 px on the long side) in the browser before it is sent; the site build then generates the smaller sizes for phones. Accepted formats: JPEG, PNG, WebP up to 20 MB before resizing.
