import React, { useState } from "react";
import DiscoveryWizard from "../../components/modals/DiscoveryWizard";
import NetBoxImporter from "../../components/modals/NetBoxImporter";
import type { DiscoveryScan } from "../../types";

const DiscoveryPage: React.FC = () => {
  const [showDiscoveryWizard, setShowDiscoveryWizard] = useState(true);
  const [showNetBoxImporter, setShowNetBoxImporter] = useState(false);

  const handleDiscoveryComplete = (scan: DiscoveryScan) => {
    setShowDiscoveryWizard(false);
  };

  const handleNetBoxImportComplete = (scan: DiscoveryScan) => {
    setShowNetBoxImporter(false);
  };

  return (
    <div className="space-y-6">
      {showDiscoveryWizard && (
        <DiscoveryWizard
          onComplete={handleDiscoveryComplete}
          onCancel={() => setShowDiscoveryWizard(false)}
        />
      )}

      {showNetBoxImporter && (
        <NetBoxImporter
          onComplete={handleNetBoxImportComplete}
          onCancel={() => setShowNetBoxImporter(false)}
        />
      )}
    </div>
  );
};

export default DiscoveryPage;
