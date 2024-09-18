import { SingleImageDropzone } from '@/components/SingleImageDropzone';
import { useEdgeStore } from '@/lib/edgestore';
import { useState } from 'react';

export default function UploadBox({ setImgUrl }: { setImgUrl: (url: string) => void }) {
  const [file, setFile] = useState<File>();
  const { edgestore } = useEdgeStore();

  return (
    <div>
      <SingleImageDropzone
        width={200}
        height={200}
        value={file}
        onChange={(file) => {
          setFile(file);
        }}
      />
      <button
        onClick={async () => {
          if (file) {
            const res = await edgestore.publicFiles.upload({
              file,
              onProgressChange: (progress) => {
                // you can use this to show a progress bar
                console.log(progress);
              },
              options: {
                temporary: true
              }
            });
            // you can run some server action or api here
            // to add the necessary data to your database
            console.log(res);
            setImgUrl(res.url)
          }
        }}
      >
        Upload
      </button>
    </div>
  );
}
