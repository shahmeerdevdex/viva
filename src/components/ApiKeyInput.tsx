
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Key, AlertCircle } from 'lucide-react';

interface ApiKeyInputProps {
  onApiKeySet: () => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeySet }) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isStored, setIsStored] = useState(false);

  useEffect(() => {
    const storedKey = localStorage.getItem('openai_api_key');
    if (storedKey) {
      setIsStored(true);
      setApiKey(storedKey);
    }
  }, []);

  const handleSaveKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('openai_api_key', apiKey.trim());
      setIsStored(true);
      onApiKeySet();
    }
  };

  const handleClearKey = () => {
    localStorage.removeItem('openai_api_key');
    setApiKey('');
    setIsStored(false);
  };

  return (
    <Card className="max-w-2xl mx-auto border-2 border-amber-200 bg-amber-50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-amber-800">
          <Key className="w-5 h-5" />
          <span>OpenAI GPT-4o Vision Analysis Setup</span>
        </CardTitle>
        <CardDescription className="text-amber-700">
          To enable GPT-4o AI facial aging analysis, please enter your OpenAI API key below.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start space-x-2 p-3 bg-blue-50 rounded-lg">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">How to get your OpenAI API key:</p>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li>Visit <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline">platform.openai.com/api-keys</a></li>
              <li>Sign in to your OpenAI account</li>
              <li>Click "Create new secret key"</li>
              <li>Copy the key and paste it below</li>
            </ol>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="api-key">OpenAI API Key</Label>
          <div className="relative">
            <Input
              id="api-key"
              type={showKey ? 'text' : 'password'}
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setShowKey(!showKey)}
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button 
            onClick={handleSaveKey}
            disabled={!apiKey.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isStored ? 'Update Key' : 'Save Key'}
          </Button>
          {isStored && (
            <Button 
              onClick={handleClearKey}
              variant="outline"
            >
              Clear Key
            </Button>
          )}
        </div>

        {isStored && (
          <div className="p-3 bg-green-50 rounded-lg text-sm text-green-800">
            ✓ API key saved. You can now proceed with GPT-4o Vision analysis.
          </div>
        )}

        <div className="text-xs text-slate-600 p-3 bg-slate-50 rounded-lg">
          <p className="font-medium mb-1">Privacy & Security:</p>
          <p>Your API key is stored locally in your browser and never sent to our servers. It's only used to communicate directly with OpenAI's API for facial analysis.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiKeyInput;
