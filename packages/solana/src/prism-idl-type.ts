/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/prism.json`.
 */
export type Prism = {
  "address": "ASUM4469PDqUc4UQLQdth3k6e5JUtKsE3fUxmaRvP7tz",
  "metadata": {
    "name": "prism",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "addLiquidity",
      "discriminator": [
        181,
        157,
        89,
        67,
        143,
        182,
        52,
        72
      ],
      "accounts": [
        {
          "name": "provider",
          "writable": true,
          "signer": true
        },
        {
          "name": "pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.mintA",
                "account": "pool"
              },
              {
                "kind": "account",
                "path": "pool.mintB",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "poolAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              }
            ]
          }
        },
        {
          "name": "providerA",
          "writable": true
        },
        {
          "name": "providerB",
          "writable": true
        },
        {
          "name": "reserveA",
          "writable": true
        },
        {
          "name": "reserveB",
          "writable": true
        },
        {
          "name": "lpMint",
          "writable": true
        },
        {
          "name": "providerLp",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "provider"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "lpMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amountA",
          "type": "u64"
        },
        {
          "name": "amountB",
          "type": "u64"
        }
      ]
    },
    {
      "name": "claimTokens",
      "docs": [
        "Exchange a funding receipt for tranche tokens."
      ],
      "discriminator": [
        108,
        216,
        210,
        231,
        0,
        212,
        42,
        64
      ],
      "accounts": [
        {
          "name": "investor",
          "writable": true,
          "signer": true,
          "relations": [
            "commitment"
          ]
        },
        {
          "name": "vault"
        },
        {
          "name": "commitment",
          "writable": true
        },
        {
          "name": "vaultAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "trancheMint",
          "writable": true
        },
        {
          "name": "investorTrancheToken",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "investor"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "trancheMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "clearVault",
      "docs": [
        "Close the window, run the launch gate, and lock rates."
      ],
      "discriminator": [
        235,
        172,
        129,
        59,
        56,
        26,
        150,
        162
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true,
          "relations": [
            "vault"
          ]
        },
        {
          "name": "config",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "vault",
          "writable": true
        },
        {
          "name": "vaultAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "alphaMint",
          "docs": [
            "One mint per tranche per vault. A default in one vault cannot reach",
            "holders in another."
          ],
          "writable": true
        },
        {
          "name": "coreMint",
          "writable": true
        },
        {
          "name": "primeMint",
          "writable": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "elBps",
          "type": {
            "array": [
              "u16",
              3
            ]
          }
        }
      ]
    },
    {
      "name": "commit",
      "docs": [
        "Commit capital to a tranche. Rates shown during the window are",
        "indicative and non-binding."
      ],
      "discriminator": [
        223,
        140,
        142,
        165,
        229,
        208,
        156,
        74
      ],
      "accounts": [
        {
          "name": "investor",
          "writable": true,
          "signer": true
        },
        {
          "name": "config",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "vault",
          "writable": true
        },
        {
          "name": "underlyingMint",
          "relations": [
            "vault"
          ]
        },
        {
          "name": "investorToken",
          "writable": true
        },
        {
          "name": "escrow",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "commitment",
          "docs": [
            "A non-transferable receipt. Tranche tokens are not minted until",
            "clearing, because before clearing the rate does not exist."
          ],
          "writable": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "seniority",
          "type": "u8"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "declareLoss",
      "docs": [
        "Record a realized loss and run the waterfall."
      ],
      "discriminator": [
        51,
        202,
        154,
        130,
        65,
        132,
        242,
        188
      ],
      "accounts": [
        {
          "name": "authority",
          "signer": true,
          "relations": [
            "vault"
          ]
        },
        {
          "name": "vault",
          "writable": true
        }
      ],
      "args": [
        {
          "name": "loss",
          "type": "u64"
        }
      ]
    },
    {
      "name": "disburse",
      "docs": [
        "Release capital to the borrower."
      ],
      "discriminator": [
        68,
        250,
        205,
        89,
        217,
        142,
        13,
        44
      ],
      "accounts": [
        {
          "name": "authority",
          "signer": true,
          "relations": [
            "vault"
          ]
        },
        {
          "name": "vault",
          "writable": true
        },
        {
          "name": "vaultAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "escrow",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "borrowerToken",
          "writable": true
        },
        {
          "name": "treasuryToken",
          "docs": [
            "PRISM's fee destination."
          ],
          "writable": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": []
    },
    {
      "name": "freezePool",
      "docs": [
        "Halt trading on a distressed vault; price discovery moves to auction."
      ],
      "discriminator": [
        211,
        216,
        1,
        216,
        54,
        191,
        102,
        150
      ],
      "accounts": [
        {
          "name": "authority",
          "signer": true,
          "relations": [
            "vault"
          ]
        },
        {
          "name": "vault"
        },
        {
          "name": "pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.mintA",
                "account": "pool"
              },
              {
                "kind": "account",
                "path": "pool.mintB",
                "account": "pool"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "frozen",
          "type": "bool"
        }
      ]
    },
    {
      "name": "initConfig",
      "docs": [
        "Create protocol config with documented defaults."
      ],
      "discriminator": [
        23,
        235,
        115,
        232,
        168,
        96,
        1,
        231
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "config",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "initPool",
      "docs": [
        "Open a pool for a tranche pair. Gated to Forge-registered mints."
      ],
      "discriminator": [
        116,
        233,
        199,
        204,
        115,
        159,
        171,
        36
      ],
      "accounts": [
        {
          "name": "creator",
          "writable": true,
          "signer": true
        },
        {
          "name": "vault",
          "docs": [
            "Pool creation is gated to Forge-registered mints. Left permissionless,",
            "anyone could list a counterfeit `pALPHA` and drain buyers who do not",
            "verify mint addresses."
          ]
        },
        {
          "name": "mintA"
        },
        {
          "name": "mintB"
        },
        {
          "name": "pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "mintA"
              },
              {
                "kind": "account",
                "path": "mintB"
              }
            ]
          }
        },
        {
          "name": "poolAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              }
            ]
          }
        },
        {
          "name": "reserveA",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  115,
                  101,
                  114,
                  118,
                  101,
                  95,
                  97
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              }
            ]
          }
        },
        {
          "name": "reserveB",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  115,
                  101,
                  114,
                  118,
                  101,
                  95,
                  98
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              }
            ]
          }
        },
        {
          "name": "lpMint",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  112,
                  95,
                  109,
                  105,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              }
            ]
          }
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "initVault",
      "docs": [
        "Open a vault and start the funding window."
      ],
      "discriminator": [
        77,
        79,
        85,
        150,
        33,
        217,
        52,
        106
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "borrower"
        },
        {
          "name": "underlyingMint",
          "docs": [
            "The underlying stablecoin. Tests mint a local token; production passes",
            "canonical USDC."
          ]
        },
        {
          "name": "config",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "vaultId"
              }
            ]
          }
        },
        {
          "name": "vaultAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "escrow",
          "docs": [
            "Escrow. Holds committed USDC until disbursement, and repayments until",
            "redemption."
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "vaultId",
          "type": "pubkey"
        },
        {
          "name": "principalTarget",
          "type": "u64"
        },
        {
          "name": "couponBps",
          "type": "u16"
        },
        {
          "name": "platformFeeBps",
          "type": "u16"
        },
        {
          "name": "fundingDeadline",
          "type": "i64"
        },
        {
          "name": "termSeconds",
          "type": "u64"
        }
      ]
    },
    {
      "name": "matureVault",
      "docs": [
        "Mark the loan repaid and open redemption."
      ],
      "discriminator": [
        154,
        88,
        240,
        241,
        217,
        35,
        230,
        98
      ],
      "accounts": [
        {
          "name": "authority",
          "signer": true,
          "relations": [
            "vault"
          ]
        },
        {
          "name": "vault",
          "writable": true
        }
      ],
      "args": []
    },
    {
      "name": "quote",
      "docs": [
        "Publish accrued redemption value per tranche."
      ],
      "discriminator": [
        149,
        42,
        109,
        247,
        134,
        146,
        213,
        123
      ],
      "accounts": [
        {
          "name": "vault"
        }
      ],
      "args": [],
      "returns": {
        "array": [
          "u64",
          3
        ]
      }
    },
    {
      "name": "redeem",
      "docs": [
        "Burn tranche tokens and pay out."
      ],
      "discriminator": [
        184,
        12,
        86,
        149,
        70,
        196,
        97,
        225
      ],
      "accounts": [
        {
          "name": "investor",
          "writable": true,
          "signer": true,
          "relations": [
            "commitment"
          ]
        },
        {
          "name": "vault",
          "writable": true
        },
        {
          "name": "commitment",
          "writable": true
        },
        {
          "name": "vaultAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "trancheMint",
          "writable": true
        },
        {
          "name": "investorTrancheToken",
          "writable": true
        },
        {
          "name": "escrow",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "investorUnderlying",
          "writable": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": []
    },
    {
      "name": "refund",
      "docs": [
        "Reclaim capital from a cancelled vault."
      ],
      "discriminator": [
        2,
        96,
        183,
        251,
        63,
        208,
        46,
        46
      ],
      "accounts": [
        {
          "name": "investor",
          "writable": true,
          "signer": true,
          "relations": [
            "commitment"
          ]
        },
        {
          "name": "vault"
        },
        {
          "name": "commitment",
          "writable": true
        },
        {
          "name": "vaultAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "escrow",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "investorUnderlying",
          "writable": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": []
    },
    {
      "name": "removeLiquidity",
      "docs": [
        "Burn LP shares for a pro-rata slice of both reserves."
      ],
      "discriminator": [
        80,
        85,
        209,
        72,
        24,
        206,
        177,
        108
      ],
      "accounts": [
        {
          "name": "provider",
          "signer": true
        },
        {
          "name": "pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.mintA",
                "account": "pool"
              },
              {
                "kind": "account",
                "path": "pool.mintB",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "poolAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              }
            ]
          }
        },
        {
          "name": "providerA",
          "writable": true
        },
        {
          "name": "providerB",
          "writable": true
        },
        {
          "name": "reserveA",
          "writable": true
        },
        {
          "name": "reserveB",
          "writable": true
        },
        {
          "name": "lpMint",
          "writable": true
        },
        {
          "name": "providerLp",
          "writable": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": [
        {
          "name": "shares",
          "type": "u64"
        }
      ]
    },
    {
      "name": "repay",
      "docs": [
        "Borrower repayment into escrow."
      ],
      "discriminator": [
        234,
        103,
        67,
        82,
        208,
        234,
        219,
        166
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "vault",
          "writable": true
        },
        {
          "name": "payerToken",
          "writable": true
        },
        {
          "name": "escrow",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "swap",
      "docs": [
        "Swap along the constant-product curve. `min_out` bounds slippage."
      ],
      "discriminator": [
        248,
        198,
        158,
        145,
        225,
        117,
        135,
        200
      ],
      "accounts": [
        {
          "name": "trader",
          "signer": true
        },
        {
          "name": "pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.mintA",
                "account": "pool"
              },
              {
                "kind": "account",
                "path": "pool.mintB",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "poolAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              }
            ]
          }
        },
        {
          "name": "traderIn",
          "writable": true
        },
        {
          "name": "traderOut",
          "writable": true
        },
        {
          "name": "reserveIn",
          "writable": true
        },
        {
          "name": "reserveOut",
          "writable": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": [
        {
          "name": "amountIn",
          "type": "u64"
        },
        {
          "name": "minOut",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updateConfig",
      "docs": [
        "Tune policy parameters. Existing vaults keep their frozen rates."
      ],
      "discriminator": [
        29,
        158,
        252,
        191,
        10,
        83,
        219,
        99
      ],
      "accounts": [
        {
          "name": "admin",
          "signer": true,
          "relations": [
            "config"
          ]
        },
        {
          "name": "config",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "update",
          "type": {
            "defined": {
              "name": "configUpdate"
            }
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "commitment",
      "discriminator": [
        61,
        112,
        129,
        128,
        24,
        147,
        77,
        87
      ]
    },
    {
      "name": "config",
      "discriminator": [
        155,
        12,
        170,
        224,
        30,
        250,
        204,
        130
      ]
    },
    {
      "name": "pool",
      "discriminator": [
        241,
        154,
        109,
        4,
        17,
        177,
        109,
        188
      ]
    },
    {
      "name": "vault",
      "discriminator": [
        211,
        8,
        232,
        43,
        2,
        152,
        117,
        119
      ]
    }
  ],
  "events": [
    {
      "name": "redemptionValue",
      "discriminator": [
        39,
        71,
        118,
        9,
        54,
        111,
        217,
        183
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "couponTooHigh",
      "msg": "Coupon exceeds the maximum permitted rate"
    },
    {
      "code": 6001,
      "name": "feeTooHigh",
      "msg": "Platform fee exceeds the maximum permitted rate"
    },
    {
      "code": 6002,
      "name": "feeExceedsCoupon",
      "msg": "Platform fee must be lower than the borrower coupon"
    },
    {
      "code": 6003,
      "name": "zeroPrincipal",
      "msg": "Principal target must be greater than zero"
    },
    {
      "code": 6004,
      "name": "deadlineInPast",
      "msg": "Funding deadline must be in the future"
    },
    {
      "code": 6005,
      "name": "vaultNotFunding",
      "msg": "Vault is not accepting commitments"
    },
    {
      "code": 6006,
      "name": "fundingWindowClosed",
      "msg": "Funding window has closed"
    },
    {
      "code": 6007,
      "name": "zeroCommitment",
      "msg": "Commitment amount must be greater than zero"
    },
    {
      "code": 6008,
      "name": "invalidSeniority",
      "msg": "Unknown tranche seniority"
    },
    {
      "code": 6009,
      "name": "trancheCapExceeded",
      "msg": "Commitment would exceed this tranche's cap"
    },
    {
      "code": 6010,
      "name": "principalTargetExceeded",
      "msg": "Commitment would exceed the vault's principal target"
    },
    {
      "code": 6011,
      "name": "fundingWindowOpen",
      "msg": "Funding window has not closed yet"
    },
    {
      "code": 6012,
      "name": "vaultNotClearable",
      "msg": "Vault is not ready for clearing"
    },
    {
      "code": 6013,
      "name": "gateUndersubscribed",
      "msg": "Launch gate: principal target not fully subscribed"
    },
    {
      "code": 6014,
      "name": "gateInsolvent",
      "msg": "Launch gate: promised interest exceeds the distributable pie"
    },
    {
      "code": 6015,
      "name": "gateAlphaBelowFloor",
      "msg": "Launch gate: ALPHA tranche is below the first-loss floor"
    },
    {
      "code": 6016,
      "name": "gateTrancheCapExceeded",
      "msg": "Launch gate: a tranche exceeds its cap"
    },
    {
      "code": 6017,
      "name": "gateRateOrdering",
      "msg": "Launch gate: tranche rates are not strictly ordered"
    },
    {
      "code": 6018,
      "name": "vaultNotActive",
      "msg": "Vault is not active"
    },
    {
      "code": 6019,
      "name": "vaultNotMatured",
      "msg": "Vault has not matured"
    },
    {
      "code": 6020,
      "name": "vaultCancelled",
      "msg": "Vault was cancelled; claim a refund instead"
    },
    {
      "code": 6021,
      "name": "lossExceedsPrincipal",
      "msg": "Declared loss exceeds the vault principal"
    },
    {
      "code": 6022,
      "name": "alreadyRedeemed",
      "msg": "This commitment has already been redeemed"
    },
    {
      "code": 6023,
      "name": "commitmentVaultMismatch",
      "msg": "Commitment does not belong to this vault"
    },
    {
      "code": 6024,
      "name": "unauthorized",
      "msg": "Only the vault authority may perform this action"
    },
    {
      "code": 6025,
      "name": "wrongMint",
      "msg": "Token account mint does not match the vault's underlying mint"
    },
    {
      "code": 6026,
      "name": "alreadyDisbursed",
      "msg": "Vault has already disbursed to the borrower"
    },
    {
      "code": 6027,
      "name": "insufficientEscrow",
      "msg": "Escrow holds insufficient funds for this operation"
    },
    {
      "code": 6028,
      "name": "zeroRepayment",
      "msg": "Repayment must be greater than zero"
    },
    {
      "code": 6029,
      "name": "vaultNotCancelled",
      "msg": "Vault is not cancelled; use redeem instead"
    },
    {
      "code": 6030,
      "name": "invalidConfig",
      "msg": "Config values are inconsistent"
    },
    {
      "code": 6031,
      "name": "insufficientLiquidity",
      "msg": "Pool has insufficient liquidity for this swap"
    },
    {
      "code": 6032,
      "name": "slippageExceeded",
      "msg": "Swap output fell below the caller's minimum"
    },
    {
      "code": 6033,
      "name": "poolFrozen",
      "msg": "Pool is frozen; the vault is distressed"
    },
    {
      "code": 6034,
      "name": "identicalMints",
      "msg": "Both tokens in a pool must differ"
    },
    {
      "code": 6035,
      "name": "mathOverflow",
      "msg": "Arithmetic overflow"
    }
  ],
  "types": [
    {
      "name": "commitment",
      "docs": [
        "A non-transferable receipt issued during the funding window.",
        "",
        "Tokens are not minted until clearing, because before clearing the rate does",
        "not exist — there is no determinate claim to tokenize."
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "vault",
            "type": "pubkey"
          },
          {
            "name": "investor",
            "type": "pubkey"
          },
          {
            "name": "seniority",
            "type": "u8"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "redeemed",
            "docs": [
              "Set once the holder has redeemed, to prevent double-claims."
            ],
            "type": "bool"
          },
          {
            "name": "payout",
            "docs": [
              "Recorded at redemption, for auditability."
            ],
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "config",
      "docs": [
        "Protocol-level policy. Every field here was a hard-coded constant until an",
        "operator needed to tune it per market; the constants remain the defaults.",
        "",
        "These are judgement calls, not derived values. The ALPHA floor in",
        "particular is a defensible default, not a measured one — revisit it once",
        "there is real loss data."
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "admin",
            "type": "pubkey"
          },
          {
            "name": "riskFreeBps",
            "docs": [
              "Benchmark a lender could earn without credit risk."
            ],
            "type": "u16"
          },
          {
            "name": "lambdaBps",
            "docs": [
              "Risk premium multiplier, in bps. 3_500 = lambda of 0.35."
            ],
            "type": "u16"
          },
          {
            "name": "alphaFloorBps",
            "docs": [
              "Minimum first-loss depth. A tranche thinner than the losses it must",
              "absorb protects nobody."
            ],
            "type": "u16"
          },
          {
            "name": "alphaCapBps",
            "type": "u16"
          },
          {
            "name": "coreCapBps",
            "type": "u16"
          },
          {
            "name": "primeCapBps",
            "type": "u16"
          },
          {
            "name": "maxCouponBps",
            "type": "u16"
          },
          {
            "name": "maxFeeBps",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "configUpdate",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "riskFreeBps",
            "type": {
              "option": "u16"
            }
          },
          {
            "name": "lambdaBps",
            "type": {
              "option": "u16"
            }
          },
          {
            "name": "alphaFloorBps",
            "type": {
              "option": "u16"
            }
          },
          {
            "name": "alphaCapBps",
            "type": {
              "option": "u16"
            }
          },
          {
            "name": "coreCapBps",
            "type": {
              "option": "u16"
            }
          },
          {
            "name": "primeCapBps",
            "type": {
              "option": "u16"
            }
          },
          {
            "name": "maxCouponBps",
            "type": {
              "option": "u16"
            }
          },
          {
            "name": "maxFeeBps",
            "type": {
              "option": "u16"
            }
          }
        ]
      }
    },
    {
      "name": "pool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "authorityBump",
            "type": "u8"
          },
          {
            "name": "mintA",
            "docs": [
              "Ordered canonically so a pair maps to exactly one PDA."
            ],
            "type": "pubkey"
          },
          {
            "name": "mintB",
            "type": "pubkey"
          },
          {
            "name": "vaultA",
            "type": "pubkey"
          },
          {
            "name": "vaultB",
            "type": "pubkey"
          },
          {
            "name": "lpMint",
            "docs": [
              "Per-pool LP mint. A share is a claim on a fraction of both reserves."
            ],
            "type": "pubkey"
          },
          {
            "name": "lpMintBump",
            "type": "u8"
          },
          {
            "name": "feeBps",
            "docs": [
              "Swap fee in bps, retained by the pool for its liquidity providers."
            ],
            "type": "u16"
          },
          {
            "name": "frozen",
            "docs": [
              "Set when the underlying vault is distressed. An AMM cannot price a",
              "defaulted loan: liquidity providers withdraw as default becomes likely,",
              "so the bid vanishes exactly when holders need it."
            ],
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "redemptionValue",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "vault",
            "type": "pubkey"
          },
          {
            "name": "at",
            "type": "i64"
          },
          {
            "name": "valueBps",
            "docs": [
              "Per-token value in bps of face, indexed by seniority. 10_500 = 1.05."
            ],
            "type": {
              "array": [
                "u64",
                3
              ]
            }
          }
        ]
      }
    },
    {
      "name": "tranche",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "committed",
            "docs": [
              "Capital committed to this tranche."
            ],
            "type": "u64"
          },
          {
            "name": "mint",
            "docs": [
              "This vault's mint for this seniority."
            ],
            "type": "pubkey"
          },
          {
            "name": "mintBump",
            "type": "u8"
          },
          {
            "name": "clearingBps",
            "docs": [
              "Rate set once at clearing, immutable thereafter."
            ],
            "type": "u16"
          },
          {
            "name": "attachLowBps",
            "docs": [
              "Loss band, in bps of principal. ALPHA attaches at 0.",
              "A tranche absorbs losses falling between attach_low and attach_high."
            ],
            "type": "u16"
          },
          {
            "name": "attachHighBps",
            "type": "u16"
          },
          {
            "name": "loss",
            "docs": [
              "Principal destroyed by the waterfall, in base units."
            ],
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "vault",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "state",
            "type": {
              "defined": {
                "name": "vaultState"
              }
            }
          },
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "borrower",
            "type": "pubkey"
          },
          {
            "name": "underlyingMint",
            "docs": [
              "The underlying stablecoin. Test deployments use a locally minted token;",
              "production replaces this with canonical USDC."
            ],
            "type": "pubkey"
          },
          {
            "name": "vaultAuthorityBump",
            "docs": [
              "PDA that signs every transfer out of escrow."
            ],
            "type": "u8"
          },
          {
            "name": "disbursed",
            "docs": [
              "Set once the borrower has drawn down. Prevents a second disbursement."
            ],
            "type": "bool"
          },
          {
            "name": "repaid",
            "docs": [
              "Principal the borrower has repaid so far."
            ],
            "type": "u64"
          },
          {
            "name": "principalTarget",
            "docs": [
              "Target raise, in the underlying token's base units."
            ],
            "type": "u64"
          },
          {
            "name": "couponBps",
            "docs": [
              "What the borrower pays, in bps. e.g. 1400 = 14%."
            ],
            "type": "u16"
          },
          {
            "name": "platformFeeBps",
            "docs": [
              "PRISM's cut off the top, in bps. e.g. 200 = 2%."
            ],
            "type": "u16"
          },
          {
            "name": "fundingDeadline",
            "docs": [
              "Unix timestamp after which no further commitments are accepted."
            ],
            "type": "i64"
          },
          {
            "name": "activatedAt",
            "docs": [
              "Set at clearing; accrual starts here."
            ],
            "type": "i64"
          },
          {
            "name": "termSeconds",
            "docs": [
              "Loan tenor in seconds. Accrual reaches the full clearing rate at term."
            ],
            "type": "u64"
          },
          {
            "name": "totalCommitted",
            "docs": [
              "Sum of all commitments across every tranche."
            ],
            "type": "u64"
          },
          {
            "name": "realizedLoss",
            "docs": [
              "Realized portfolio loss, in base units. Set when a loss is declared."
            ],
            "type": "u64"
          },
          {
            "name": "tranches",
            "docs": [
              "Per-tranche book, indexed by seniority (0=ALPHA, 1=CORE, 2=PRIME)."
            ],
            "type": {
              "array": [
                {
                  "defined": {
                    "name": "tranche"
                  }
                },
                3
              ]
            }
          }
        ]
      }
    },
    {
      "name": "vaultState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "funding"
          },
          {
            "name": "active"
          },
          {
            "name": "matured"
          },
          {
            "name": "cancelled"
          }
        ]
      }
    }
  ],
  "constants": [
    {
      "name": "alphaCapBps",
      "docs": [
        "Caps concentration regardless of how much demand arrives for high yield."
      ],
      "type": "u16",
      "value": "2500"
    },
    {
      "name": "alphaFloorBps",
      "docs": [
        "A thin first-loss tranche protects nobody: a 2% ALPHA tranche is wiped by a",
        "2% loss, leaving CORE and PRIME exposed to risk they did not price."
      ],
      "type": "u16",
      "value": "1000"
    },
    {
      "name": "bpsDenom",
      "docs": [
        "Basis points denominator."
      ],
      "type": "u64",
      "value": "10000"
    },
    {
      "name": "commitmentSeed",
      "type": "bytes",
      "value": "[99, 111, 109, 109, 105, 116]"
    },
    {
      "name": "configSeed",
      "type": "bytes",
      "value": "[99, 111, 110, 102, 105, 103]"
    },
    {
      "name": "coreCapBps",
      "type": "u16",
      "value": "4000"
    },
    {
      "name": "defaultLambdaBps",
      "docs": [
        "Risk premium multiplier. 3_500 = lambda of 0.35."
      ],
      "type": "u16",
      "value": "3500"
    },
    {
      "name": "defaultRiskFreeBps",
      "docs": [
        "Benchmark a lender could earn without credit risk. Tokenized treasuries",
        "sat at 4-5% when this was chosen."
      ],
      "type": "u16",
      "value": "500"
    },
    {
      "name": "defaultTermSeconds",
      "docs": [
        "Default loan tenor: 12 months."
      ],
      "type": "u64",
      "value": "31536000"
    },
    {
      "name": "lpMintSeed",
      "type": "bytes",
      "value": "[108, 112, 95, 109, 105, 110, 116]"
    },
    {
      "name": "maxCouponBps",
      "docs": [
        "Sanity bound on borrower coupon."
      ],
      "type": "u16",
      "value": "5000"
    },
    {
      "name": "maxFeeBps",
      "docs": [
        "Sanity bound on the platform fee."
      ],
      "type": "u16",
      "value": "1000"
    },
    {
      "name": "poolAuthoritySeed",
      "type": "bytes",
      "value": "[112, 111, 111, 108, 95, 97, 117, 116, 104, 111, 114, 105, 116, 121]"
    },
    {
      "name": "poolSeed",
      "type": "bytes",
      "value": "[112, 111, 111, 108]"
    },
    {
      "name": "primeCapBps",
      "type": "u16",
      "value": "8000"
    },
    {
      "name": "swapFeeBps",
      "docs": [
        "AMM swap fee, in bps."
      ],
      "type": "u16",
      "value": "30"
    },
    {
      "name": "trancheMintSeed",
      "docs": [
        "One mint per tranche per vault. `pALPHA-LF3` and `pALPHA-AB2` are distinct",
        "assets: a default in one vault cannot reach holders in another."
      ],
      "type": "bytes",
      "value": "[116, 114, 97, 110, 99, 104, 101, 95, 109, 105, 110, 116]"
    },
    {
      "name": "trancheSeed",
      "type": "bytes",
      "value": "[116, 114, 97, 110, 99, 104, 101]"
    },
    {
      "name": "vaultAuthoritySeed",
      "docs": [
        "Signs every transfer out of the vault's escrow."
      ],
      "type": "bytes",
      "value": "[118, 97, 117, 108, 116, 95, 97, 117, 116, 104, 111, 114, 105, 116, 121]"
    },
    {
      "name": "vaultSeed",
      "type": "bytes",
      "value": "[118, 97, 117, 108, 116]"
    }
  ]
};
