<?xml version="1.0" encoding="UTF-8"?>
<!--
  XSLT 1.0 (works in browsers and xsltproc). Turns site-structure.xml into a mobile-first HTML skeleton of the home page.
  The CSS is the same mobile-first approach the live site uses: phone styles first, media queries only add.
-->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="UTF-8" indent="yes" doctype-system="about:legacy-compat"/>

  <xsl:template match="/website">
    <html lang="en">
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="{meta/viewport/@content}"/>
        <title><xsl:value-of select="pages/page[@path='/']/@title"/></title>
        <style>
          :root{--ink:#07131F;--signal:#FF9D2E;--signal-ink:#B35A00;--air:#E2E8F0;--gutter:clamp(24px,6vw,72px)}
          *{box-sizing:border-box}
          body{margin:0;color:var(--ink);font:16px/1.5 "Neue Montreal",system-ui,sans-serif}
          img,svg,video{max-width:100%;height:auto}
          .wrap{padding:32px var(--gutter)}
          /* mobile: tab bar fixed at the bottom */
          nav{position:fixed;inset:auto 0 0 0;display:flex;background:#fff;border-top:1px solid rgba(7,19,31,.12)}
          nav a{flex:1;min-height:44px;display:grid;place-items:center;color:inherit;text-decoration:none;font-size:14px}
          main{padding-bottom:88px}
          h1{font-size:clamp(36px,calc(36px + 20 * (100vw - 360px) / 920),56px)}
          .actions{display:grid;grid-template-columns:1fr 1fr;gap:16px}
          .btn{min-height:48px;display:grid;place-items:center;border-radius:999px;background:var(--signal);color:var(--ink);text-decoration:none}
          .btn.secondary{background:rgba(7,19,31,.07)}
          .grid{display:grid;grid-template-columns:1fr;gap:16px}
          a:focus-visible{outline:2px solid var(--ink);outline-offset:2px}
          /* tablet: two columns */
          @media (min-width:481px){.grid{grid-template-columns:repeat(2,1fr)}}
          /* desktop: four columns, nav floats at the top */
          @media (min-width:769px){.grid{grid-template-columns:repeat(4,1fr)}}
          @media (min-width:901px){nav{inset:16px auto auto 50%;transform:translateX(-50%);border:1px solid rgba(7,19,31,.07);border-radius:999px}main{padding-bottom:0;padding-top:112px}}
        </style>
      </head>
      <body>
        <nav aria-label="{layout/navigation/@label}">
          <xsl:for-each select="layout/navigation/item">
            <a href="{@href}"><xsl:value-of select="@label"/></a>
          </xsl:for-each>
        </nav>
        <main id="main">
          <xsl:apply-templates select="pages/page[@path='/']/section"/>
        </main>
      </body>
    </html>
  </xsl:template>

  <xsl:template match="section">
    <section id="{@id}" class="wrap">
      <xsl:apply-templates select="heading|text|actions|grid"/>
    </section>
  </xsl:template>

  <xsl:template match="heading">
    <xsl:element name="h{@level}"><xsl:value-of select="."/></xsl:element>
  </xsl:template>
  <xsl:template match="text"><p><xsl:value-of select="."/></p></xsl:template>
  <xsl:template match="actions">
    <div class="actions">
      <xsl:for-each select="button">
        <a href="{@href}">
          <xsl:attribute name="class">btn<xsl:if test="@style='secondary'"> secondary</xsl:if></xsl:attribute>
          <xsl:value-of select="@label"/>
        </a>
      </xsl:for-each>
    </div>
  </xsl:template>
  <xsl:template match="grid">
    <div class="grid">
      <xsl:for-each select="card"><a class="btn secondary" href="{@href}"><xsl:value-of select="@title"/></a></xsl:for-each>
    </div>
  </xsl:template>
</xsl:stylesheet>
