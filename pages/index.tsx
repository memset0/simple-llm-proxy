import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Table from '@mui/joy/Table';
import Typography from '@mui/joy/Typography';
import Card from '@mui/joy/Card';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import Link from '@mui/joy/Link';
import { useState, useEffect } from 'react';

const examples = [
  {
    name: 'OpenAI',
    from: 'https://api.openai.com/v1/chat/completions',
    to: '/openai/v1/chat/completions',
  },
  {
    name: 'Anthropic',
    from: 'https://api.anthropic.com/v1/messages',
    to: '/anthropic/v1/messages',
  },
  {
    name: 'Google Gemini',
    from: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent',
    to: '/google/v1beta/models/gemini-1.5-pro:generateContent',
  },
];

const providers = [
  {
    provider: 'openai',
    host: 'api.openai.com',
  },
  {
    provider: 'anthropic',
    host: 'api.anthropic.com',
  },
  {
    provider: 'google',
    host: 'generativelanguage.googleapis.com',
  },
];

export default function Home() {
  const [currentHost, setCurrentHost] = useState('<host>');

  useEffect(() => {
    setCurrentHost(window.location.protocol + '//' + window.location.host);
  }, []);

  return (
    <CssVarsProvider>
      <CssBaseline />
      <Box
        sx={{
          maxWidth: 800,
          mx: 'auto',
          p: 4,
        }}
      >
        <Typography level="h1" component="h1">
          Simple LLM Router
          <a href="https://github.com/memset0/simple-llm-router " target="_blank" style={{ marginLeft: '0.5em' }}>
            <img src="https://img.shields.io/github/stars/memset0/simple-llm-router" alt="GitHub Stars" />
          </a>
        </Typography>

        <Typography level="body-md" sx={{ mt: 2 }}>
          A simple router service for various LLM providers, powered by Next.js.
        </Typography>

        <Typography level="title-lg" sx={{ mt: 4 }}>
          Supported Providers
        </Typography>
        <Table aria-label="basic table" sx={{ mt: 2, '& td': { wordBreak: 'break-word' } }}>
          <thead>
            <tr>
              <th style={{ width: '20%' }}>Provider</th>
              <th>Route Url</th>
              <th>Original Host</th>
            </tr>
          </thead>
          <tbody>
            {providers.map((provider) => (
              <tr key={provider.provider}>
                <td>{provider.provider}</td>
                <td>{currentHost + '/' + provider.provider}</td>
                <td>{'https://' + provider.host}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Typography level="title-lg" sx={{ mt: 4 }}>
          Examples
        </Typography>
        <Card variant="outlined" sx={{ mt: 2, p: 0.5 }}>
          <List>
            {examples.map((provider) => (
              <ListItem key={provider.name}>
                <Typography sx={{ fontSize: '0.9em', py: 0.2 }}>
                  <strong style={{ fontSize: '1.1em' }}>{provider.name}</strong>
                  <br />
                  <code>{provider.from}</code>
                  <br />
                  ➜&nbsp;&nbsp;<code>{currentHost + provider.to}</code>
                </Typography>
              </ListItem>
            ))}
          </List>
        </Card>

        <Typography level="title-lg" sx={{ mt: 4 }}>
          Links
        </Typography>
        <List>
          <ListItem>
            <Link href="https://github.com/memset0/simple-llm-proxy" target="_blank">
              GitHub Repository
            </Link>
          </ListItem>
        </List>
      </Box>
    </CssVarsProvider>
  );
}
