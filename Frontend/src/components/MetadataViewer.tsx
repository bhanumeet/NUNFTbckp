import { IMetadata } from "../interfaces/IMetadata";
import styles from "./MetadataViewer.module.css";

interface MetadataViewerProps {
  metadata: IMetadata | null;
}
const MetadataViewer: React.FC<MetadataViewerProps> = ({ metadata }) => {
  return (
    <div className={styles.metadataContainer}>
      {metadata && (
        <pre className={styles.preFormattedText}>
          {JSON.stringify(metadata, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default MetadataViewer;
