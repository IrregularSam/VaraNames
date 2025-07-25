import { useEffect, useState } from 'react';
import { NightlyConnectAdapter } from '@nightlylabs/wallet-selector-polkadot';

function WalletConnect() {
  const [adapter, setAdapter] = useState(null);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const init = async () => {
      const instance = await NightlyConnectAdapter.build({
        appMetadata: {
          name: 'VaraName',
          description: 'Human-readable name service for Vara',
          icon: 'https://i.imgur.com/jmd2vj4.jpeg',
        },
        network: 'Vara',
      });

      setAdapter(instance);

      const canReconnect = await instance.canEagerConnect();
      if (canReconnect) {
        setLoading(true);
        await instance.connect();
        const accounts = await instance.accounts.get();
        setAddress(accounts[0].address);
        setLoading(false);
      }
    };

    init();
  }, []);

  const connect = async () => {
    if (!adapter) return;
    try {
      setLoading(true);
      await adapter.connect();
      const accounts = await adapter.accounts.get();
      setAddress(accounts[0].address);
    } catch (err) {
      console.error('Connection failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const disconnect = async () => {
    if (adapter) {
      await adapter.disconnect();
      setAddress(null);
      setMenuOpen(false);
    }
  };

  const shortAddress = (addr) => addr.slice(0, 4) + '...' + addr.slice(-4);

  return (
    <div className="relative inline-block text-left cursor-pointer">
      {address ? (
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="px-4 py-2 bg-green-100 text-green-700 rounded-full border border-green-300 hover:bg-green-200 transition cursor-pointer"
        >
          🟢 {shortAddress(address)}
        </button>
      ) : (
        <button
          onClick={connect}
          disabled={loading}
          className={`px-4 py-2 text-black rounded-full transition ${
            loading
              ? 'bg-green-400 cursor-not-allowed'
              : 'bg-green-400 hover:bg-green-500'
          }`}
        >
          {loading ? (
            <>
              <span className="inline-block w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Connecting...
            </>
          ) : (
            ' Connect Wallet'
          )}
        </button>
      )}

      {menuOpen && (
        <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-md shadow-lg z-50">
          <button
            onClick={disconnect}
            className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 rounded-md"
          >
            🔌 Disconnect
          </button>
        </div>
      )}
    </div>
  );
}

export default WalletConnect;
