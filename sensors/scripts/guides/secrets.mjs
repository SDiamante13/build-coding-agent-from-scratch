export const secrets = {
  'leaked-secret': [
    'A credential written into source is compromised the moment it lands. Deleting the line does not un-leak it — anyone who pulled, any CI log, any editor backup already has it.',
    'Rotate it first. Revoke the key at the provider and issue a new one. Everything after that step is cleanup, and cleanup on a live credential is theatre.',
    'Then keep it out: read it from the environment at the outer shell and hand it inward as configuration, so the domain takes it as a parameter and never learns where it came from. A secret is an input, exactly like a clock.',
    'If it reached a commit, the working tree is no longer where it lives. Rewriting history or revoking at the repository level is the follow-up — and that is a conversation to have out loud, not a quiet fix.',
    'Not this: a `gitleaks:allow` comment, a `.gitleaksignore` entry, or a narrower scan path. Each one leaves the credential live and removes the only thing that was going to tell you about it.',
  ],
};
